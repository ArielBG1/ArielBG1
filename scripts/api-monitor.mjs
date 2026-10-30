#!/usr/bin/env node
/**
 * API monitor: genera un SVG estilo dashboard de monitoreo con las contribuciones de GitHub
 * del último año como "requests por día" (1 request = 1 contribución).
 *
 * Uso:
 *   node scripts/api-monitor.mjs --user ArielBG1 --handle ariel-bogado --out dist [--html calendario.html]
 *
 * - Con la variable GITHUB_TOKEN usa la API GraphQL de GitHub (la vía oficial, la que usa la Action).
 * - Sin token (o si GraphQL falla) lee el calendario público de contribuciones del perfil.
 * - `--html` permite pasar un calendario ya descargado (útil para probar sin red).
 *
 * Genera api-monitor.svg (es, oscuro), api-monitor-light.svg (es, claro), api-monitor-en.svg y
 * api-monitor-en-light.svg (los usa el portafolio), y para el README api-monitor-compact.svg (solo el gráfico)
 * y api-langs.svg (lenguajes más usados en los repos públicos propios).
 * Sin dependencias: solo Node 20+.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const { values: args } = parseArgs({
  options: {
    user: { type: 'string' },
    /** Nombre que se muestra en el título (por defecto, el usuario en minúsculas). */
    handle: { type: 'string' },
    out: { type: 'string', default: 'dist' },
    html: { type: 'string' },
  },
});

if (!args.user) {
  console.error('Falta --user <usuario de GitHub>');
  process.exit(1);
}

/* -------------------------------------------------------------------------- */
/* Datos                                                                       */
/* -------------------------------------------------------------------------- */

/** @typedef {{ date: string, count: number }} Day */
/** @typedef {{ name: string, color: string | null, size: number }} Lang */

async function graphql(query, variables, token) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'api-monitor' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await response.json();
  if (!response.ok || json.errors) throw new Error(`GraphQL: ${response.status} ${JSON.stringify(json.errors ?? json)}`);
  return json.data;
}

/** Calendario del último año vía GraphQL (requiere token). @returns {Promise<Day[]>} */
async function fromGraphQL(user, token) {
  const query = `query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }`;
  const data = await graphql(query, { login: user }, token);
  return data.user.contributionsCollection.contributionCalendar.weeks
    .flatMap((week) => week.contributionDays)
    .map((day) => ({ date: day.date, count: day.contributionCount }));
}

/** Bytes de código por lenguaje en los repos públicos propios (sin forks), vía GraphQL. */
async function langsFromGraphQL(user, token) {
  const query = `query ($login: String!) {
    user(login: $login) {
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
        nodes { languages(first: 20, orderBy: { field: SIZE, direction: DESC }) { edges { size node { name color } } } }
      }
    }
  }`;
  const repos = (await graphql(query, { login: user }, token)).user.repositories.nodes;
  /** @type {Map<string, Lang>} */
  const langs = new Map();
  for (const repo of repos) {
    for (const { size, node } of repo.languages.edges) {
      langs.set(node.name, { name: node.name, color: node.color, size: (langs.get(node.name)?.size ?? 0) + size });
    }
  }
  return { repos: repos.length, langs: [...langs.values()] };
}

// La API REST no devuelve colores: estos son los de GitHub (linguist) para los lenguajes más comunes.
const LANG_COLORS = {
  'C#': '#178600', JavaScript: '#f1e05a', TypeScript: '#3178c6', HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c',
  Python: '#3572A5', Java: '#b07219', PHP: '#4F5D95', Go: '#00ADD8', Kotlin: '#A97BFF', Dart: '#00B4AB', C: '#555555',
  'C++': '#f34b7d', Shell: '#89e051', PowerShell: '#012456', Dockerfile: '#384d54', TSQL: '#e38c00', PLpgSQL: '#336790',
  Vue: '#41b883', 'Jupyter Notebook': '#DA5B0B', Batchfile: '#C1F12E', EJS: '#a91e50', Handlebars: '#f7931e',
};

/** Lo mismo con la API REST pública (sin token). */
async function langsFromRest(user) {
  const headers = { 'User-Agent': 'api-monitor', Accept: 'application/vnd.github+json' };
  const get = async (url) => {
    const response = await fetch(url, { headers });
    const json = await response.json();
    if (!response.ok) throw new Error(`REST ${url}: ${response.status} ${json.message ?? ''}`);
    return json;
  };
  const repos = (await get(`https://api.github.com/users/${user}/repos?per_page=100&type=owner`)).filter((repo) => !repo.fork);
  /** @type {Map<string, Lang>} */
  const langs = new Map();
  for (const repo of repos) {
    for (const [name, size] of Object.entries(await get(repo.languages_url))) {
      langs.set(name, { name, color: LANG_COLORS[name] ?? null, size: (langs.get(name)?.size ?? 0) + size });
    }
  }
  return { repos: repos.length, langs: [...langs.values()] };
}

/** Calendario público del perfil (el mismo HTML que muestra GitHub). @returns {Promise<Day[]>} */
async function fromPublicCalendar(user, htmlFile) {
  const html = htmlFile
    ? await readFile(htmlFile, 'utf8')
    : await (await fetch(`https://github.com/users/${user}/contributions`, { headers: { 'User-Agent': 'api-monitor' } })).text();

  // Cada día es un <td data-date="…" id="…">; la cantidad está en el <tool-tip for="…"> asociado.
  const tooltips = new Map();
  for (const match of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    tooltips.set(match[1], match[2]);
  }
  const days = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = /\bdata-date="([^"]+)"/.exec(tag)?.[1];
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    if (!date || !id) continue;
    const count = Number(/^(\d+) contributions?/.exec(tooltips.get(id) ?? '')?.[1] ?? 0);
    days.push({ date, count });
  }
  if (days.length === 0) throw new Error('No se pudo leer el calendario público de contribuciones.');
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

/* -------------------------------------------------------------------------- */
/* Métricas                                                                    */
/* -------------------------------------------------------------------------- */

/** @param {Day[]} days */
function computeStats(days) {
  const total = days.reduce((sum, day) => sum + day.count, 0);

  // Racha actual: días seguidos con actividad hasta hoy. Si hoy todavía no hubo actividad, cuenta desde ayer.
  let current = 0;
  let index = days.length - 1;
  if (index >= 0 && days[index].count === 0) index -= 1;
  while (index >= 0 && days[index].count > 0) {
    current += 1;
    index -= 1;
  }

  let longest = 0;
  let run = 0;
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }

  const peak = days.reduce((best, day) => (day.count > best.count ? day : best), { date: days[0]?.date ?? '', count: 0 });
  const activeDays = days.filter((day) => day.count > 0).length;
  return { total, current, longest, peak, activeDays };
}

/* -------------------------------------------------------------------------- */
/* SVG                                                                         */
/* -------------------------------------------------------------------------- */

const LABELS = {
  es: {
    title: 'API monitor',
    live: 'live',
    updated: 'actualizado',
    subtitle: 'requests/día · 1 request = 1 contribución en GitHub · últimos 12 meses',
    total: 'total',
    requests: 'requests',
    current: 'racha actual',
    longest: 'racha máxima',
    days: (n) => (n === 1 ? 'día' : 'días'),
    peak: 'día pico',
    contributions: 'contribuciones',
    langs: 'lenguajes más usados',
    langsDesc: (user, list) => `${user}: lenguajes más usados en sus repositorios públicos. ${list}.`,
    desc: (s, user, peakDate) =>
      `${user}: ${s.total} contribuciones en GitHub en los últimos 12 meses. Racha actual: ${s.current} días. Racha máxima: ${s.longest} días. Día pico: ${s.peak.count} contribuciones el ${peakDate}.`,
  },
  en: {
    title: 'API monitor',
    live: 'live',
    updated: 'updated',
    subtitle: 'requests/day · 1 request = 1 GitHub contribution · last 12 months',
    total: 'total',
    requests: 'requests',
    current: 'current streak',
    longest: 'longest streak',
    days: (n) => (n === 1 ? 'day' : 'days'),
    peak: 'peak day',
    contributions: 'contributions',
    langs: 'most used languages',
    langsDesc: (user, list) => `${user}: most used languages in their public repositories. ${list}.`,
    desc: (s, user, peakDate) =>
      `${user}: ${s.total} GitHub contributions in the last 12 months. Current streak: ${s.current} days. Longest streak: ${s.longest} days. Peak day: ${s.peak.count} contributions on ${peakDate}.`,
  },
};

const THEMES = {
  dark: {
    bg: '#0e0e19', bar: '#151524', border: '#262640', card: '#13131f', fg: '#e6e6f0', muted: '#9a9ab0',
    key: '#a397f7', ok: '#10b981', grid: '#262640', zero: '#2a2a42', from: '#512bd4', mid: '#7c6cf2', to: '#00b4d8', scan: '#00b4d8',
  },
  light: {
    bg: '#ffffff', bar: '#f6f6fa', border: '#dcdce8', card: '#f6f6fa', fg: '#14141f', muted: '#55556b',
    key: '#512bd4', ok: '#047857', grid: '#e4e4ee', zero: '#dcdce8', from: '#512bd4', mid: '#6d5df0', to: '#0b6e8f', scan: '#0b6e8f',
  },
};

const MONO = "'IBM Plex Mono','Fira Code',Consolas,Menlo,monospace";
const SANS = "'IBM Plex Sans','Segoe UI',-apple-system,'Helvetica Neue',Arial,sans-serif";

const escapeXml = (text) => String(text).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]);
const toUtc = (iso) => new Date(`${iso}T00:00:00Z`);
const shortDate = (iso, lang) =>
  new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(toUtc(iso)).replace('.', '');
const monthName = (iso, lang) => new Intl.DateTimeFormat(lang, { month: 'short', timeZone: 'UTC' }).format(toUtc(iso)).replace('.', '');

/**
 * @param {Day[]} days
 * `compact: true` deja solo el gráfico, sin la línea explicativa ni los KPI (versión del README).
 */
function renderSvg(days, stats, { user, handle, lang, theme, updated, compact = false }) {
  const t = LABELS[lang];
  const c = THEMES[theme];
  const W = 880;
  const H = compact ? 210 : 300;
  const PAD = 20;
  const chart = { x: PAD, y: compact ? 64 : 92, w: W - PAD * 2, h: 112 };
  const title = compact ? t.contributions : t.title;
  const step = chart.w / days.length;
  const barWidth = Math.max(1, step - 0.6);
  const max = Math.max(1, stats.peak.count);
  // Escala con raíz para que los días chicos se sigan viendo al lado de un pico grande.
  const barHeight = (count) => (count > 0 ? Math.max(3, Math.pow(count / max, 0.6) * chart.h) : 1.5);
  const font = MONO;
  const sans = SANS;

  const bars = days
    .map((day, i) => {
      const h = barHeight(day.count);
      const x = (chart.x + i * step).toFixed(2);
      const y = (chart.y + chart.h - h).toFixed(2);
      const fill = day.count > 0 ? 'url(#bar)' : c.zero;
      return `<rect class="b" x="${x}" y="${y}" width="${barWidth.toFixed(2)}" height="${h.toFixed(2)}" fill="${fill}" style="animation-delay:${i * 4}ms"/>`;
    })
    .join('');

  // Etiquetas de meses (al comienzo de cada mes, sin superponerse).
  const MIN_GAP = 42;
  const starts = days.map((day, i) => ({ day, x: chart.x + i * step })).filter(({ day }, i) => i === 0 || day.date.endsWith('-01'));
  const months = [];
  let lastX = -Infinity;
  starts.forEach(({ day, x }, index) => {
    const next = starts[index + 1];
    if (index === 0 && !day.date.endsWith('-01') && next && next.x - x < MIN_GAP) return;
    if (x - lastX < MIN_GAP || x > chart.x + chart.w - 24) return;
    months.push(`<text x="${x.toFixed(1)}" y="${chart.y + chart.h + 18}" class="m">${escapeXml(monthName(day.date, lang))}</text>`);
    lastX = x;
  });

  const peakIndex = days.findIndex((day) => day.date === stats.peak.date && day.count === stats.peak.count);
  const peakX = chart.x + peakIndex * step + barWidth / 2;
  const peakY = chart.y + chart.h - barHeight(stats.peak.count);
  const peakLabelX = Math.min(Math.max(peakX, chart.x + 16), chart.x + chart.w - 16);

  const kpis = [
    { label: t.total, value: stats.total, unit: t.requests },
    { label: t.current, value: stats.current, unit: t.days(stats.current) },
    { label: t.longest, value: stats.longest, unit: t.days(stats.longest) },
    { label: t.peak, value: stats.peak.count, unit: stats.peak.count > 0 ? `· ${shortDate(stats.peak.date, lang)}` : '' },
  ];
  const gap = 12;
  const kpiW = (chart.w - gap * 3) / 4;
  const kpiY = 238;
  const kpiBoxes = kpis
    .map((kpi, i) => {
      const x = chart.x + i * (kpiW + gap);
      return `<g transform="translate(${x.toFixed(1)} ${kpiY})">
      <rect width="${kpiW.toFixed(1)}" height="46" rx="8" fill="${c.card}" stroke="${c.border}"/>
      <text x="12" y="17" class="kl">${escapeXml(kpi.label)}</text>
      <text x="12" y="37" class="kv">${escapeXml(kpi.value)}<tspan class="ku" dx="6">${escapeXml(kpi.unit)}</tspan></text>
    </g>`;
    })
    .join('');

  const desc = t.desc(stats, user, shortDate(stats.peak.date, lang));

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">${escapeXml(`${handle} · ${title}`)}</title>
  <desc id="d">${escapeXml(desc)}</desc>
  <defs>
    <linearGradient id="bar" gradientUnits="userSpaceOnUse" x1="0" y1="${chart.y + chart.h}" x2="0" y2="${chart.y}">
      <stop offset="0" stop-color="${c.from}"/>
      <stop offset="0.55" stop-color="${c.mid}"/>
      <stop offset="1" stop-color="${c.to}"/>
    </linearGradient>
    <linearGradient id="scan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c.scan}" stop-opacity="0"/>
      <stop offset="1" stop-color="${c.scan}" stop-opacity="0.18"/>
    </linearGradient>
    <clipPath id="chart"><rect x="${chart.x}" y="${chart.y - 4}" width="${chart.w}" height="${chart.h + 4}"/></clipPath>
  </defs>
  <style>
    text { font-family: ${font}; fill: ${c.muted}; font-size: 11px; }
    .title { fill: ${c.fg}; font-size: 13px; font-weight: 600; }
    .key { fill: ${c.key}; font-size: 13px; font-weight: 600; }
    .ok { fill: ${c.ok}; }
    .m { font-size: 10.5px; }
    .kl { font-size: 10.5px; }
    .kv { fill: ${c.fg}; font-family: ${sans}; font-size: 18px; font-weight: 600; }
    .ku { fill: ${c.muted}; font-family: ${font}; font-size: 11px; font-weight: 400; }
    .b { transform-box: fill-box; transform-origin: 50% 100%; animation: grow 0.7s cubic-bezier(.2,.8,.2,1) both; }
    .scan { animation: scan 7s linear infinite; }
    .dot { animation: pulse 1.6s ease-in-out infinite; }
    .peak { animation: fade 0.6s ease-out 1.6s both; }
    @keyframes grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes scan { from { transform: translateX(0); } to { transform: translateX(${chart.w + 60}px); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
    @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .b, .scan, .dot, .peak { animation: none; } .scan { display: none; } }
  </style>

  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="${c.bg}" stroke="${c.border}"/>
  <path d="M0.5 40.5 V12.5 Q0.5 0.5 12.5 0.5 H${W - 12.5} Q${W - 0.5} 0.5 ${W - 0.5} 12.5 V40.5 Z" fill="${c.bar}"/>
  <line x1="0" y1="40.5" x2="${W}" y2="40.5" stroke="${c.border}"/>

  <text x="${PAD}" y="25" class="key">{ }</text>
  <text x="${PAD + 26}" y="25" class="title">${escapeXml(handle)}<tspan class="ku" dx="8">· ${escapeXml(title)}</tspan></text>
  <circle class="dot" cx="${W - 196}" cy="21" r="4" fill="${c.ok}"/>
  <text x="${W - 186}" y="25" class="ok">${escapeXml(t.live)}</text>
  <text x="${W - PAD}" y="25" text-anchor="end">${escapeXml(`${t.updated} ${shortDate(updated, lang)}`)}</text>

  ${compact ? '' : `<text x="${PAD}" y="66">${escapeXml(t.subtitle)}</text>`}

  <line x1="${chart.x}" y1="${chart.y}" x2="${chart.x + chart.w}" y2="${chart.y}" stroke="${c.grid}" stroke-dasharray="3 4"/>
  <line x1="${chart.x}" y1="${chart.y + chart.h / 2}" x2="${chart.x + chart.w}" y2="${chart.y + chart.h / 2}" stroke="${c.grid}" stroke-dasharray="3 4"/>
  <line x1="${chart.x}" y1="${chart.y + chart.h + 0.5}" x2="${chart.x + chart.w}" y2="${chart.y + chart.h + 0.5}" stroke="${c.border}"/>

  <g clip-path="url(#chart)">
    ${bars}
    <g class="scan"><rect x="${chart.x - 60}" y="${chart.y - 4}" width="60" height="${chart.h + 4}" fill="url(#scan)"/><rect x="${chart.x - 1}" y="${chart.y - 4}" width="1" height="${chart.h + 4}" fill="${c.scan}" opacity="0.6"/></g>
  </g>

  ${
    stats.peak.count > 0
      ? `<g class="peak"><circle cx="${peakX.toFixed(1)}" cy="${(peakY - 6).toFixed(1)}" r="2.5" fill="${c.to}"/><text x="${peakLabelX.toFixed(1)}" y="${(peakY - 12).toFixed(1)}" text-anchor="middle" class="ok">${stats.peak.count}</text></g>`
      : ''
  }
  ${months.join('')}
  ${compact ? '' : kpiBoxes}
</svg>
`;
}

/**
 * Lenguajes más usados, con el mismo marco que el monitor: barra apilada y una leyenda de una línea.
 * @param {Lang[]} langs ordenados de mayor a menor
 */
function renderLangsSvg(langs, { user, handle, lang, theme }) {
  const t = LABELS[lang];
  const c = THEMES[theme];
  const W = 880;
  const PAD = 20;
  const H = 124;
  const total = langs.reduce((sum, l) => sum + l.size, 0);
  const top = langs.slice(0, 6).map((l) => ({ ...l, share: l.size / total }));
  const percent = new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const colorOf = (l) => l.color ?? c.muted;

  // El resto (lenguajes fuera del top) queda como el fondo de la barra.
  const bar = { x: PAD, y: 62, w: W - PAD * 2, h: 10 };
  let x = bar.x;
  const segments = top
    .map((l, i) => {
      const w = l.share * bar.w;
      const markup = `<rect class="seg" x="${x.toFixed(2)}" y="${bar.y}" width="${Math.max(0, w - 2).toFixed(2)}" height="${bar.h}" fill="${colorOf(l)}" style="animation-delay:${i * 90}ms"/>`;
      x += w;
      return markup;
    })
    .join('');

  const colW = bar.w / top.length;
  const legend = top
    .map((l, i) => {
      const lx = bar.x + i * colW;
      return `<circle cx="${(lx + 4).toFixed(1)}" cy="99" r="4" fill="${colorOf(l)}"/><text x="${(lx + 14).toFixed(1)}" y="103" class="name">${escapeXml(l.name)}<tspan dx="6">${percent.format(l.share * 100)} %</tspan></text>`;
    })
    .join('');

  const list = top.map((l) => `${l.name} ${percent.format(l.share * 100)} %`).join(', ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
  <title id="t">${escapeXml(`${handle} · ${t.langs}`)}</title>
  <desc id="d">${escapeXml(t.langsDesc(user, list))}</desc>
  <defs><clipPath id="bar"><rect x="${bar.x}" y="${bar.y}" width="${bar.w}" height="${bar.h}" rx="${bar.h / 2}"/></clipPath></defs>
  <style>
    text { font-family: ${MONO}; fill: ${c.muted}; font-size: 11px; }
    .title { fill: ${c.fg}; font-size: 13px; font-weight: 600; }
    .key { fill: ${c.key}; font-size: 13px; font-weight: 600; }
    .ku { fill: ${c.muted}; font-weight: 400; }
    .name { fill: ${c.fg}; font-size: 11.5px; }
    .name tspan { fill: ${c.muted}; }
    .seg { transform-box: fill-box; transform-origin: 0 50%; animation: grow 0.8s cubic-bezier(.2,.8,.2,1) both; }
    @keyframes grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    @media (prefers-reduced-motion: reduce) { .seg { animation: none; } }
  </style>

  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="${c.bg}" stroke="${c.border}"/>
  <path d="M0.5 40.5 V12.5 Q0.5 0.5 12.5 0.5 H${W - 12.5} Q${W - 0.5} 0.5 ${W - 0.5} 12.5 V40.5 Z" fill="${c.bar}"/>
  <line x1="0" y1="40.5" x2="${W}" y2="40.5" stroke="${c.border}"/>
  <text x="${PAD}" y="25" class="key">{ }</text>
  <text x="${PAD + 26}" y="25" class="title">${escapeXml(handle)}<tspan class="ku" dx="8">· ${escapeXml(t.langs)}</tspan></text>

  <rect x="${bar.x}" y="${bar.y}" width="${bar.w}" height="${bar.h}" rx="${bar.h / 2}" fill="${c.zero}"/>
  <g clip-path="url(#bar)">${segments}</g>
  ${legend}
</svg>
`;
}

/* -------------------------------------------------------------------------- */

const token = process.env.GITHUB_TOKEN;
let days;
if (token && !args.html) {
  try {
    days = await fromGraphQL(args.user, token);
    console.log(`GraphQL: ${days.length} días`);
  } catch (error) {
    console.warn(`GraphQL falló (${error.message}); uso el calendario público.`);
  }
}
days ??= await fromPublicCalendar(args.user, args.html);
console.log(`Calendario: ${days.length} días, del ${days[0].date} al ${days.at(-1).date}`);

const stats = computeStats(days);
console.log(`total ${stats.total} · racha ${stats.current} · máx ${stats.longest} · pico ${stats.peak.count} (${stats.peak.date})`);

const updated = days.at(-1).date;
await mkdir(args.out, { recursive: true });
const outputs = [
  ['api-monitor.svg', 'es', 'dark'],
  ['api-monitor-light.svg', 'es', 'light'],
  ['api-monitor-en.svg', 'en', 'dark'],
  ['api-monitor-en-light.svg', 'en', 'light'],
  ['api-monitor-compact.svg', 'es', 'dark', true],
];
const handle = args.handle ?? args.user.toLowerCase();
for (const [file, lang, theme, compact] of outputs) {
  await writeFile(join(args.out, file), renderSvg(days, stats, { user: args.user, handle, lang, theme, updated, compact }));
  console.log(`  ${join(args.out, file)}`);
}

// Lenguajes más usados, para el README (necesitan red: con --html, que es para probar sin red, se omiten).
if (args.html) {
  console.log('Con --html no se generan los lenguajes.');
} else {
  let languages;
  if (token) {
    try {
      languages = await langsFromGraphQL(args.user, token);
    } catch (error) {
      console.warn(`GraphQL (lenguajes) falló (${error.message}); uso la API REST.`);
    }
  }
  languages ??= await langsFromRest(args.user);
  const langs = languages.langs.filter((l) => l.size > 0).sort((a, b) => b.size - a.size);
  if (langs.length === 0) throw new Error('No hay lenguajes para mostrar.');
  console.log(`Lenguajes (${languages.repos} repos): ${langs.slice(0, 6).map((l) => l.name).join(', ')}`);
  const file = join(args.out, 'api-langs.svg');
  await writeFile(file, renderLangsSvg(langs, { user: args.user, handle, lang: 'es', theme: 'dark' }));
  console.log(`  ${file}`);
}
