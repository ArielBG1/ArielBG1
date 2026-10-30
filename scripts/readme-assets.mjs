#!/usr/bin/env node
/**
 * Genera los paneles SVG del README con el mismo lenguaje visual del portafolio
 * (bloques de operación estilo Swagger, consolas, tarjetas, paleta .NET).
 *
 * Uso:  node scripts/readme-assets.mjs
 * Requiere internet: los íconos se descargan de la API pública de Iconify y quedan embebidos en cada SVG.
 *
 * Si cambia el contenido del portafolio, actualizá DATA (abajo) y volvé a correr el script.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets');

/* -------------------------------------------------------------------------- */
/* Contenido (mismo que el portafolio)                                         */
/* -------------------------------------------------------------------------- */

const DATA = {
  handle: 'ariel-bogado',
  name: 'Ariel Bogado',
  title: 'Backend Developer · C# / .NET',
  location: 'Paraguay',
  apiPath: '/api/v1/ariel-bogado',
  roles: [
    'Backend Developer | C# · .NET',
    'APIs REST · PostgreSQL · SQL Server',
    'Frontend con React + Tailwind',
    'Estudiante de Ingeniería Informática',
  ],
  profileJson: {
    nombre: 'Ariel Bogado',
    rol: 'Backend Developer',
    ubicacion: 'Paraguay',
    perfil: [
      'Backend Developer | C# · .NET',
      'APIs REST · PostgreSQL · SQL Server',
      'Frontend con React + Tailwind',
      'Estudiante de Ingeniería Informática',
    ],
    intereses: ['IA aplicada', 'Sistemas distribuidos'],
  },
  bio: 'Desarrollador backend con más de 2 años de experiencia en C# y .NET, enfocado en el desarrollo y mantenimiento de sistemas en producción para la gestión universitaria. Experiencia en bases de datos PostgreSQL y SQL Server, APIs REST, relevamiento de requerimientos y coordinación de equipos de desarrollo, además de desarrollo frontend con React, Tailwind CSS y Bootstrap. Estudiante de 5.º año de Ingeniería Informática, con interés en IA aplicada y sistemas distribuidos.',
  highlights: [
    { icon: 'building-2', text: '**Software Developer en UNIDA**: desarrollo y mantengo la plataforma universitaria en .NET, relevo requerimientos con las áreas usuarias y lidero al equipo de desarrollo' },
    { icon: 'briefcase', text: 'Proyectos **freelance**: sistemas de gestión, punto de venta e inventario' },
    { icon: 'graduation-cap', text: 'Estudiante de 5.º año de **Ingeniería Informática**' },
    { icon: 'brain-circuit', text: 'Me interesan la **IA aplicada** y los **sistemas distribuidos**' },
    { icon: 'map-pin', text: 'Paraguay' },
  ],
  stack: [
    { label: 'Frontend', icon: 'monitor', link: 'HTTP · JSON', items: [['skill-icons:react-dark', 'React'], ['skill-icons:vite-dark', 'Vite'], ['skill-icons:tailwindcss-dark', 'Tailwind CSS'], ['skill-icons:bootstrap', 'Bootstrap'], ['skill-icons:javascript', 'JavaScript'], ['skill-icons:html', 'HTML'], ['skill-icons:css', 'CSS']] },
    { label: 'Backend', icon: 'server', link: 'SQL', items: [['skill-icons:cs', 'C#'], ['skill-icons:dotnet', '.NET'], ['skill-icons:nodejs-dark', 'Node.js'], ['skill-icons:expressjs-dark', 'Express'], ['skill-icons:java-dark', 'Java'], ['skill-icons:spring-dark', 'Spring Boot'], ['skill-icons:python-dark', 'Python'], ['skill-icons:flask-dark', 'Flask'], ['skill-icons:fastapi', 'FastAPI']] },
    { label: 'Bases de datos', icon: 'database', items: [['skill-icons:postgresql-dark', 'PostgreSQL'], ['skill-icons:mysql-dark', 'MySQL'], ['devicon:microsoftsqlserver', 'SQL Server'], ['devicon:oracle', 'Oracle']] },
  ],
  tools: { label: 'Herramientas', icon: 'wrench', items: [['skill-icons:docker', 'Docker'], ['skill-icons:git', 'Git'], ['skill-icons:github-dark', 'GitHub'], ['skill-icons:visualstudio-dark', 'Visual Studio'], ['skill-icons:vscode-dark', 'VS Code'], ['skill-icons:postman', 'Postman']] },
  experience: {
    role: 'Software Developer',
    company: 'Universidad de la Integración de las Américas (UNIDA)',
    period: 'Abril 2024 – Presente',
    groups: [
      {
        title: 'Desarrollo',
        items: [
          'Desarrollo nuevas funcionalidades y realizo el mantenimiento de la plataforma universitaria en C# con ASP.NET MVC y ASP.NET Core (.NET 10).',
          'Construyo módulos y APIs REST a medida para distintas áreas de la universidad, desde el modelado de datos hasta la integración con otros sistemas.',
          'Modelo bases de datos en SQL Server y optimizo el acceso a datos mediante consultas SQL y LINQ.',
          'Diagnostico y corrijo incidencias en producción, y automatizo procesos internos para reducir tareas manuales.',
        ],
      },
      {
        title: 'Liderazgo y análisis',
        items: [
          'Relevo requerimientos con las distintas áreas de la universidad, los analizo y defino el alcance de cada desarrollo.',
          'Planifico y distribuyo las tareas del equipo de desarrollo según prioridades, bajo la supervisión de la Jefatura de Sistemas.',
          'Reviso el trabajo entregado por el equipo y hago seguimiento del cumplimiento de plazos.',
          'Valido las entregas con los usuarios y elaboro documentación técnica de los sistemas.',
        ],
      },
    ],
  },
  projects: [
    {
      slug: 'cyclo', featured: true, icon: 'recycle', accent: '#10b981',
      title: 'Cyclo — Plataforma de economía circular',
      role: 'Desarrollador full stack · Líder técnico',
      description: 'App ciudadana de reciclaje con mapa interactivo, reconocimiento de materiales por cámara (CycloScan) y gamificación con validación por geolocalización. Disponible en español, inglés y coreano. Lideré el desarrollo en el **Global Green Challenge**, junto a INHA University (Corea del Sur).',
      stack: [['skill-icons:react-dark', 'React'], ['skill-icons:vite-dark', 'Vite'], ['skill-icons:tailwindcss-dark', 'Tailwind CSS'], ['skill-icons:nodejs-dark', 'Node.js'], ['skill-icons:expressjs-dark', 'Express'], ['skill-icons:postgresql-dark', 'PostgreSQL + PostGIS'], ['skill-icons:tensorflow-dark', 'TensorFlow.js']],
      repo: 'github.com/ArielBG1/Cyclo', demo: 'cyclo-nine.vercel.app',
    },
    {
      slug: 'despensa-app', icon: 'shopping-cart', accent: '#7c6cf2',
      title: 'DespensaAPP — POS e inventario',
      description: 'Punto de venta e inventario para comercio minorista: lector de código de barras, productos por peso, compras, auditoría de stock y roles.',
      stack: [['skill-icons:cs', 'C#'], ['skill-icons:dotnet', '.NET'], ['skill-icons:postgresql-dark', 'PostgreSQL']],
    },
    {
      slug: 'facial-attendance', icon: 'scan-face', accent: '#7c6cf2',
      title: 'Asistencia con reconocimiento facial',
      description: 'Marcación docente que valida ventana horaria, proximidad GPS (100 m) e identidad facial con anti-spoofing usando DeepFace y SQL Server.',
      stack: [['skill-icons:python-dark', 'Python'], ['skill-icons:flask-dark', 'Flask'], ['skill-icons:opencv-dark', 'OpenCV'], ['devicon:microsoftsqlserver', 'SQL Server']],
    },
    {
      slug: 'ticket-support', icon: 'ticket', accent: '#7c6cf2', team: 'Proyecto en equipo',
      title: 'Soporte por tickets',
      description: 'Sistema de mesa de ayuda para registrar y dar seguimiento a tickets de soporte.',
      stack: [['skill-icons:nodejs-dark', 'Node.js'], ['skill-icons:javascript', 'JavaScript']],
    },
    {
      slug: 'torotech-landing', icon: 'layout-template', accent: '#7c6cf2',
      title: 'Torotech — Landing Page',
      description: 'Landing page para Torotech, la plataforma educativa del Instituto Técnico Superior Santa María del Rosario (ITSSMAR).',
      stack: [['skill-icons:html', 'HTML'], ['skill-icons:css', 'CSS']],
    },
  ],
  contactText: '¿Tenés una propuesta de trabajo o un proyecto freelance en mente? Escribime y te respondo a la brevedad.',
  contactJson: {
    email: 'arielbogadogimenez@gmail.com',
    linkedin: 'linkedin.com/in/arielbogadogimenez',
    github: 'github.com/ArielBG1',
    ubicacion: 'Paraguay',
  },
  buttons: [
    { file: 'btn-portafolio.svg', icon: 'globe', label: 'Portafolio', value: 'arielbogado.vercel.app', arrow: 'arrow-up-right', slot: [0, 3] },
    { file: 'btn-linkedin.svg', icon: 'linkedin', label: 'LinkedIn', value: 'in/arielbogadogimenez', arrow: 'arrow-up-right', slot: [1, 3] },
    { file: 'btn-email.svg', icon: 'mail', label: 'Email', value: 'arielbogadogimenez@gmail.com', arrow: 'arrow-right', slot: [2, 3] },
    { file: 'btn-cyclo-demo.svg', icon: 'external-link', label: 'Cyclo · Demo en vivo', value: 'cyclo-nine.vercel.app', arrow: 'arrow-up-right', slot: [0, 2] },
    { file: 'btn-cyclo-repo.svg', icon: 'github', label: 'Cyclo · Repositorio', value: 'github.com/ArielBG1/Cyclo', arrow: 'arrow-up-right', slot: [1, 2] },
  ],
};

/* -------------------------------------------------------------------------- */
/* Estilo (paleta del portafolio, tema oscuro)                                 */
/* -------------------------------------------------------------------------- */

const W = 880;
// El README pone las imágenes de una misma fila sin espacios entre medio (ver README.md), así que las
// separaciones van dentro de cada SVG: todo queda alineado a los bordes del ancho completo.
const GAP = 7; // ≈ el espacio vertical que GitHub deja entre imágenes; también separa encabezado y cuerpo
const SECTION_TOP = 32; // aire antes de cada sección
const HEAD = 84; // alto del encabezado de sección
const BODY_TOP = SECTION_TOP + HEAD + GAP;
const C = {
  surface: '#13131f', surface2: '#1a1a2a', console: '#0e0e19', bar: '#151524', border: '#23233a', cborder: '#262640',
  fg: '#e6e6f0', soft: '#c9c9d9', muted: '#9a9ab0', brand: '#a397f7', primary: '#512bd4', get: '#00b4d8', ok: '#10b981', warn: '#f59e0b',
  key: '#a397f7', string: '#34d399', number: '#38bdf8', punct: '#8b8ba3', tile: '#242938',
};
const OP = {
  GET: { tint: '#121e2c', border: '#155d79', solid: '#00b4d8' },
  POST: { tint: '#131f26', border: '#1b5f56', solid: '#10b981' },
};
const MONO = "'IBM Plex Mono','Fira Code',Consolas,Menlo,monospace";
const SANS = "'IBM Plex Sans','Segoe UI',-apple-system,'Helvetica Neue',Arial,sans-serif";
// Ancho promedio de un carácter (en em) para estimar cortes de línea. Segoe UI / SF / Arial rondan 0,45-0,5;
// los títulos en negrita usan SANS_BOLD_EM.
const SANS_EM = 0.5;
const SANS_BOLD_EM = 0.55;
const MONO_EM = 0.61;

const esc = (value) => String(value).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]);
const textWidth = (text, size, em = SANS_EM) => text.length * size * em;

/* -------------------------------------------------------------------------- */
/* Íconos (Iconify)                                                            */
/* -------------------------------------------------------------------------- */

const ICONS = new Map();
let idCounter = 0;

async function loadIcons() {
  const wanted = new Map();
  const add = (id) => {
    const [prefix, name] = id.includes(':') ? id.split(':') : ['lucide', id];
    if (!wanted.has(prefix)) wanted.set(prefix, new Set());
    wanted.get(prefix).add(name);
  };
  DATA.highlights.forEach((h) => add(h.icon));
  [...DATA.stack, DATA.tools].forEach((layer) => { add(layer.icon); layer.items.forEach(([id]) => add(id)); });
  DATA.projects.forEach((p) => { add(p.icon); p.stack.forEach(([id]) => add(id)); });
  DATA.buttons.forEach((b) => { add(b.icon); add(b.arrow); });
  ['braces', 'map-pin', 'chevron-down', 'arrow-up-down', 'arrow-left', 'terminal', 'calendar', 'star', 'user-round-cog', 'users', 'external-link', 'github'].forEach(add);

  for (const [prefix, names] of wanted) {
    const url = `https://api.iconify.design/${prefix}.json?icons=${[...names].join(',')}`;
    const json = await (await fetch(url)).json();
    for (const name of names) {
      // Algunos nombres son alias (ej.: building-2 → building-complex).
      const icon = json.icons?.[name] ?? json.icons?.[json.aliases?.[name]?.parent];
      if (!icon) throw new Error(`Ícono no encontrado: ${prefix}:${name}`);
      ICONS.set(`${prefix}:${name}`, { body: icon.body, width: icon.width ?? json.width, height: icon.height ?? json.height });
    }
  }
}

/** Ícono embebido como <svg> anidado. Los ids internos se renombran para que no choquen entre íconos. */
function icon(id, x, y, size, color) {
  const key = id.includes(':') ? id : `lucide:${id}`;
  const data = ICONS.get(key);
  if (!data) throw new Error(`Ícono no cargado: ${key}`);
  const suffix = `i${(idCounter += 1)}`;
  let body = data.body;
  const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  ids.forEach((original) => {
    body = body.split(`"${original}"`).join(`"${original}-${suffix}"`).split(`#${original})`).join(`#${original}-${suffix})`).split(`#${original}"`).join(`#${original}-${suffix}"`);
  });
  const colorAttr = color ? ` color="${color}"` : '';
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 ${data.width} ${data.height}"${colorAttr}>${body}</svg>`;
}

/** Tecnología: los íconos de devicon van sobre una baldosa oscura, como los de skill-icons. */
function techIcon(id, x, y, size) {
  if (id.startsWith('skill-icons:')) return icon(id, x, y, size);
  const inner = size * 0.82;
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.23}" fill="${C.tile}"/>${icon(id, x + (size - inner) / 2, y + (size - inner) / 2, inner)}`;
}

/* -------------------------------------------------------------------------- */
/* Texto                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Divide "texto con **negritas**" en palabras. Una palabra puede mezclar estilos sin espacio en el medio
 * (ej.: "**UNIDA**:"), así que cada una guarda sus partes.
 */
function richWords(text) {
  const words = [];
  let glued = false; // la próxima parte va pegada a la palabra anterior
  text.split('**').forEach((segment, index) => {
    const bold = index % 2 === 1;
    segment.split(/(\s+)/).forEach((piece) => {
      if (!piece) return;
      if (!piece.trim()) {
        glued = false;
        return;
      }
      if (glued && words.length) words[words.length - 1].parts.push({ text: piece, bold });
      else words.push({ parts: [{ text: piece, bold }] });
      glued = true;
    });
  });
  return words.map((w) => ({ ...w, word: w.parts.map((p) => p.text).join('') }));
}

/** Corta texto (con negritas opcionales) en líneas de hasta `maxWidth` px. */
function wrapRich(text, maxWidth, size, em = SANS_EM) {
  const lines = [];
  let line = [];
  let width = 0;
  for (const word of richWords(text)) {
    const w = textWidth(`${word.word} `, size, em);
    if (width + w > maxWidth && line.length) {
      lines.push(line);
      line = [];
      width = 0;
    }
    line.push(word);
    width += w;
  }
  if (line.length) lines.push(line);
  return lines;
}

function renderRichLines(lines, x, y, lineHeight, cls, size, weight = 400) {
  return lines
    .map((line, i) => {
      const spans = line
        .map((w, j) => {
          const parts = w.parts.map((p) => (p.bold ? `<tspan font-weight="600" fill="${C.fg}">${esc(p.text)}</tspan>` : esc(p.text))).join('');
          return j < line.length - 1 ? `${parts} ` : parts;
        })
        .join('');
      return `<text x="${x}" y="${y + i * lineHeight}" class="${cls}" font-size="${size}" font-weight="${weight}">${spans}</text>`;
    })
    .join('');
}

/** JSON → líneas con resaltado (mismo esquema de colores que el sitio). Las listas cortas de valores van en una línea. */
function jsonLines(value, indent = 0, prefix = '', comma = false, out = []) {
  const pad = '  '.repeat(indent);
  const tail = comma ? '<tspan class="p">,</tspan>' : '';
  const isPrimitive = (v) => v === null || typeof v !== 'object';
  if (Array.isArray(value) && value.every(isPrimitive) && value.map((v) => JSON.stringify(v)).join(', ').length <= 44) {
    const items = value.map((v) => `<tspan class="${typeof v === 'string' ? 's' : 'n'}">${esc(JSON.stringify(v))}</tspan>`).join('<tspan class="p">, </tspan>');
    out.push(`${pad}${prefix}<tspan class="p">[</tspan>${items}<tspan class="p">]</tspan>${tail}`);
    return out;
  }
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    const isArray = Array.isArray(value);
    const entries = isArray ? value.map((v) => [null, v]) : Object.entries(value);
    out.push(`${pad}${prefix}<tspan class="p">${isArray ? '[' : '{'}</tspan>`);
    entries.forEach(([k, v], i) => {
      const keyPart = k === null ? '' : `<tspan class="k">"${esc(k)}"</tspan><tspan class="p">: </tspan>`;
      jsonLines(v, indent + 1, keyPart, i < entries.length - 1, out);
    });
    out.push(`${pad}<tspan class="p">${isArray ? ']' : '}'}</tspan>${tail}`);
    return out;
  }
  const cls = typeof value === 'string' ? 's' : 'n';
  out.push(`${pad}${prefix}<tspan class="${cls}">${esc(JSON.stringify(value))}</tspan>${tail}`);
  return out;
}

/* -------------------------------------------------------------------------- */
/* Piezas comunes                                                              */
/* -------------------------------------------------------------------------- */

function svg(width, height, title, body, extraCss = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t">
<title id="t">${esc(title)}</title>
<style>
  text { font-family: ${SANS}; }
  /* Especificidad 0 (:where) para que ganen las clases, y :not([...]) para no pisar los atributos fill/font-size. */
  :where(text:not([fill])) { fill: ${C.muted}; }
  :where(text:not([font-size])) { font-size: 13px; }
  .mono { font-family: ${MONO}; }
  .fg { fill: ${C.fg}; }
  .soft { fill: ${C.soft}; }
  .brand { fill: ${C.brand}; }
  .ok { fill: ${C.ok}; }
  .k { fill: ${C.key}; } .s { fill: ${C.string}; } .n { fill: ${C.number}; } .p { fill: ${C.punct}; }
  ${extraCss}
</style>
${body}
</svg>
`;
}

/** Barra de operación estilo Swagger (igual que los encabezados de sección del portafolio). */
function opblock(method, path, title, status, y = SECTION_TOP, height = HEAD) {
  const op = OP[method];
  const pillW = method.length * 8.6 + 18;
  const pathX = 24 + pillW + 12;
  const pathW = textWidth(path, 14, MONO_EM);
  const statusW = textWidth(status, 13, MONO_EM);
  return `<g transform="translate(0 ${y})">
  <rect x="0.5" y="0.5" width="${W - 1}" height="${height - 1}" rx="12" fill="${op.tint}" stroke="${op.border}"/>
  <rect x="24" y="18" width="${pillW}" height="22" rx="5" fill="${op.solid}"/>
  <text x="${24 + pillW / 2}" y="33.5" text-anchor="middle" class="mono" font-size="12" font-weight="600" fill="#0b0b14" letter-spacing="0.6">${method}</text>
  <text x="${pathX}" y="34" class="mono fg" font-size="14">${esc(path)}</text>
  <line x1="${pathX + pathW + 14}" y1="29.5" x2="${W - 24 - statusW - 14}" y2="29.5" stroke="${C.muted}" stroke-opacity="0.35" stroke-dasharray="3 4"/>
  <text x="${W - 24}" y="34" text-anchor="end" class="mono ok" font-size="13">${esc(status)}</text>
  <text x="24" y="68" class="fg" font-size="25" font-weight="600" letter-spacing="-0.4">${esc(title)}</text>
  ${icon('chevron-down', W - 44, 50, 20, C.muted)}
</g>`;
}

/** Tarjeta (superficie del sitio). */
const card = (x, y, w, h, fill = C.surface, stroke = C.border, rx = 12) =>
  `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`;

/** Chip de tecnología: ícono + nombre. Devuelve markup y ancho. */
function chip(id, name, x, y, size = 13) {
  const iconSize = 22;
  const w = 8 + iconSize + 8 + textWidth(name, size, SANS_BOLD_EM) + 12;
  return {
    w,
    markup: `${card(x, y, w, 32, C.surface2, C.border, 8)}${techIcon(id, x + 5, y + 5, iconSize)}<text x="${x + 5 + iconSize + 8}" y="${y + 21}" class="soft" font-size="${size}">${esc(name)}</text>`,
  };
}

/** Coloca chips en filas dentro de un ancho máximo. */
function chipRows(items, x, y, maxWidth, gap = 8) {
  let cx = x;
  let cy = y;
  const parts = [];
  items.forEach(([id, name]) => {
    const probe = chip(id, name, 0, 0);
    if (cx + probe.w > x + maxWidth && cx > x) {
      cx = x;
      cy += 32 + gap;
    }
    parts.push(chip(id, name, cx, cy).markup);
    cx += probe.w + gap;
  });
  return { markup: parts.join(''), height: cy - y + 32 };
}

/* -------------------------------------------------------------------------- */
/* Paneles                                                                     */
/* -------------------------------------------------------------------------- */

function hero() {
  const H = 324;
  const json = jsonLines(DATA.profileJson);
  const box = { x: 440, y: 58, w: 416, h: 244 };
  const jsonMarkup = json
    .map((line, i) => `<text x="${box.x + 16}" y="${box.y + 52 + i * 15}" class="mono j" font-size="11" xml:space="preserve" style="animation-delay:${1.6 + i * 0.07}s">${line}</text>`)
    .join('');
  const roles = DATA.roles
    .map((role, i) => `<text x="44" y="282" class="mono role${i === 0 ? ' first' : ''}" font-size="14" style="animation-delay:${i * 3}s">${esc(role)}</text>`)
    .join('');
  const css = `
  .path { animation: type 1s steps(20) 0.3s backwards; }
  .pending { opacity: 0; animation: pending 1.5s linear; }
  .done { animation: show 0.3s ease-out 1.5s backwards; }
  .j { animation: show 0.25s ease-out backwards; }
  .role { fill: ${C.get}; opacity: 0; animation: role ${DATA.roles.length * 3}s linear infinite; }
  .role.first { opacity: 1; }
  .cursor { animation: blink 1.1s step-end infinite; }
  @keyframes type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
  @keyframes pending { from, to { opacity: 1; } }
  @keyframes show { from { opacity: 0; } to { opacity: 1; } }
  @keyframes role { 0% { opacity: 0; } 2% { opacity: 1; } 23% { opacity: 1; } 25% { opacity: 0; } 100% { opacity: 0; } }
  @keyframes blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .path, .done, .j, .cursor { animation: none; }
    .pending { display: none; }
    .role { animation: none; opacity: 0; } .role.first { opacity: 1; }
  }`;
  const body = `
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="rgba(230,230,240,0.045)"/></pattern>
    <radialGradient id="glow" cx="0.15" cy="0" r="0.8"><stop offset="0" stop-color="#512bd4" stop-opacity="0.2"/><stop offset="1" stop-color="#512bd4" stop-opacity="0"/></radialGradient>
  </defs>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="14" fill="${C.console}" stroke="${C.cborder}"/>
  <rect x="1" y="41" width="${W - 2}" height="${H - 42}" fill="url(#grid)"/>
  <rect x="1" y="41" width="${W - 2}" height="${H - 42}" fill="url(#glow)"/>
  <path d="M0.5 40.5V14.5Q0.5 0.5 14.5 0.5H${W - 14.5}Q${W - 0.5} 0.5 ${W - 0.5} 14.5V40.5Z" fill="${C.bar}"/>
  <line x1="0" y1="40.5" x2="${W}" y2="40.5" stroke="${C.cborder}"/>
  <text x="22" y="25" class="mono brand" font-weight="600">{ }</text>
  <text x="48" y="25" class="mono fg" font-weight="600" font-size="12.5">${DATA.handle}<tspan class="mono" fill="${C.muted}" font-weight="400" dx="8">/ API v1</tspan></text>
  <circle cx="${W - 106}" cy="21" r="4" fill="${C.warn}" class="pending"/><text x="${W - 22}" y="25" text-anchor="end" class="mono pending" fill="${C.warn}" font-size="12">pendiente…</text>
  <circle cx="${W - 76}" cy="21" r="4" fill="${C.ok}" class="done"/><text x="${W - 22}" y="25" text-anchor="end" class="mono ok done" font-size="12">200 OK</text>

  <rect x="28" y="70" width="42" height="22" rx="5" fill="${C.get}"/>
  <text x="49" y="85.5" text-anchor="middle" class="mono" font-size="12" font-weight="600" fill="#0b0b14">GET</text>
  <text x="82" y="86.5" class="mono fg path" font-size="14.5">${DATA.apiPath}</text>
  <text x="26" y="160" class="fg" font-size="48" font-weight="600" letter-spacing="-1.2">${esc(DATA.name)}</text>
  <text x="28" y="196" class="soft" font-size="19" font-weight="500">${esc(DATA.title)}</text>
  ${icon('map-pin', 28, 214, 16, C.get)}<text x="50" y="227" class="soft" font-size="14">${esc(DATA.location)}</text>
  <text x="28" y="282" class="mono brand" font-size="14">&gt;</text>
  ${roles}

  ${card(box.x, box.y, box.w, box.h, '#0b0b14', C.cborder, 10)}
  <path d="M${box.x + 0.5} ${box.y + 30.5}V${box.y + 10.5}Q${box.x + 0.5} ${box.y + 0.5} ${box.x + 10.5} ${box.y + 0.5}H${box.x + box.w - 10.5}Q${box.x + box.w - 0.5} ${box.y + 0.5} ${box.x + box.w - 0.5} ${box.y + 10.5}V${box.y + 30.5}Z" fill="${C.bar}"/>
  <line x1="${box.x}" y1="${box.y + 30.5}" x2="${box.x + box.w}" y2="${box.y + 30.5}" stroke="${C.cborder}"/>
  <text x="${box.x + 14}" y="${box.y + 20}" class="mono" font-size="11">Respuesta</text>
  <text x="${box.x + box.w - 14}" y="${box.y + 20}" text-anchor="end" class="mono" font-size="11"><tspan class="ok">200 OK</tspan> · application/json</text>
  ${jsonMarkup}
  <rect x="${box.x + 16}" y="${box.y + 52 + json.length * 15 - 10}" width="7" height="13" fill="${C.brand}" class="cursor"/>`;
  return svg(W, H, `GET ${DATA.apiPath} · 200 OK — ${DATA.name}, ${DATA.title}`, body, css);
}

/**
 * Celda `index` de una fila de `count` imágenes que en el README ocupan `100/count %` cada una.
 * Devuelve el ancho de la imagen, el de la tarjeta y dónde dibujarla para que entre tarjetas quede GAP.
 */
function slot(index, count) {
  const slotW = W / count;
  const cardW = (W - GAP * (count - 1)) / count;
  return { slotW, cardW, x: index * (cardW + GAP - slotW) };
}

function button({ icon: iconName, label, value, arrow, slot: [index, count] }) {
  const { slotW, cardW: w, x } = slot(index, count);
  const h = 60;
  const body = `<g transform="translate(${x} 0)">${card(0, 0, w, h)}
  <rect x="10" y="10" width="40" height="40" rx="9" fill="${C.primary}"/>
  ${icon(iconName, 20, 20, 20, '#ffffff')}
  <text x="62" y="27" class="fg" font-size="15" font-weight="600">${esc(label)}</text>
  <text x="62" y="45" class="mono" font-size="11">${esc(value)}</text>
  ${icon(arrow, w - 32, 21, 18, C.muted)}</g>`;
  return svg(slotW, h, `${label}: ${value}`, body);
}

function about() {
  const top = BODY_TOP;
  const pad = 24;
  const bioW = 430;
  const bioLines = wrapRich(DATA.bio, bioW, 14.5);
  const bioH = bioLines.length * 24;
  const hlX = pad + bioW + 28;
  const hlW = W - hlX - pad;
  const textW = hlW - 32 - 52;
  let hy = top + pad + 16;
  const highlights = DATA.highlights
    .map((h) => {
      const lines = wrapRich(h.text, textW, 13.5);
      const block = `${card(hlX + 16, hy, 34, 34, C.surface2, C.border, 9)}${icon(h.icon, hlX + 25, hy + 9, 16, C.brand)}${renderRichLines(lines, hlX + 62, hy + 16, 20, 'soft', 13.5)}`;
      hy += Math.max(34, lines.length * 20) + 14;
      return block;
    })
    .join('');
  const hlH = hy - (top + pad + 16) + 2;
  const bodyH = Math.max(bioH + 8, hlH + 16) + pad * 2;
  const H = top + bodyH;
  const body = `${opblock('GET', '/sobre-mi', 'Sobre mí', '200 OK')}
  ${card(0, top, W, bodyH)}
  ${renderRichLines(bioLines, pad, top + pad + 20, 24, 'soft', 14.5)}
  ${card(hlX, top + pad, hlW, hlH + 16, C.console, C.border, 12)}
  ${highlights}`;
  return svg(W, H, `GET /sobre-mi — Sobre mí. ${DATA.bio}`, body);
}

function stack() {
  const top = BODY_TOP;
  const pad = 24;
  const lineX = pad + 14;
  const layerX = pad + 40;
  const toolsW = 200;
  const layerW = W - pad * 2 - 40 - toolsW - 20;
  let y = top + pad;
  const nodes = [];
  const layers = DATA.stack
    .map((layer, i) => {
      const rows = chipRows(layer.items, layerX + 18, y + 48, layerW - 36);
      const h = 48 + rows.height + 18;
      nodes.push(y + 27);
      let markup = `${card(layerX, y, layerW, h)}${icon(layer.icon, layerX + 18, y + 17, 18, C.get)}<text x="${layerX + 44}" y="${y + 31}" class="fg" font-size="15" font-weight="600">${esc(layer.label)}</text>${rows.markup}`;
      y += h;
      if (layer.link) {
        const tagW = textWidth(layer.link, 11.5, MONO_EM) + 40;
        markup += `${card(layerX, y + 10, tagW, 24, 'none', C.border, 6).replace('stroke=', 'stroke-dasharray="3 3" stroke=')}${icon('arrow-up-down', layerX + 8, y + 15, 14, C.muted)}<text x="${layerX + 28}" y="${y + 26}" class="mono" font-size="11.5">${esc(layer.link)}</text>`;
        y += 44;
      }
      return markup;
    })
    .join('');
  const total = DATA.stack.reduce((n, l) => n + l.items.length, 0) + DATA.tools.items.length;
  const summaryY = y + 26;
  const pipeline = `<line x1="${lineX}" y1="${nodes[0]}" x2="${lineX}" y2="${summaryY - 4}" stroke="${C.border}" stroke-width="1.5"/>
  <line x1="${lineX}" y1="${nodes[0]}" x2="${lineX}" y2="${nodes[nodes.length - 1]}" stroke="${C.brand}" stroke-width="1.5"/>
  ${nodes.map((ny) => `<circle cx="${lineX}" cy="${ny}" r="5.5" fill="${C.surface}" stroke="${C.brand}" stroke-width="2"/>`).join('')}
  <circle cx="${lineX}" cy="${nodes[0]}" r="7" fill="${C.ok}" stroke="rgba(16,185,129,0.25)" stroke-width="6"/>
  ${icon('arrow-left', layerX, summaryY - 13, 16, C.ok)}<text x="${layerX + 24}" y="${summaryY}" class="mono ok" font-size="13">200 OK · ${total} tecnologías</text>`;

  // Herramientas: grilla de baldosas a la derecha.
  const tx = W - pad - toolsW;
  const tileW = (toolsW - 36 - 10) / 2;
  const tiles = DATA.tools.items
    .map(([id, name], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = tx + 18 + col * (tileW + 10);
      const ty = top + pad + 50 + row * 86;
      return `${card(x, ty, tileW, 76, C.surface2, C.border, 9)}${techIcon(id, x + tileW / 2 - 16, ty + 11, 32)}<text x="${x + tileW / 2}" y="${ty + 63}" text-anchor="middle" class="soft" font-size="11.5">${esc(name)}</text>`;
    })
    .join('');
  const toolsH = 50 + Math.ceil(DATA.tools.items.length / 2) * 86 + 8;
  const tools = `${card(tx, top + pad, toolsW, toolsH)}${icon(DATA.tools.icon, tx + 18, top + pad + 17, 18, C.get)}<text x="${tx + 44}" y="${top + pad + 31}" class="fg" font-size="15" font-weight="600">${esc(DATA.tools.label)}</text>${tiles}`;

  const H = Math.max(summaryY + pad, top + pad + toolsH + pad);
  const all = [...DATA.stack.flatMap((l) => l.items), ...DATA.tools.items].map(([, n]) => n).join(', ');
  return svg(W, H, `GET /stack — Stack tecnológico: ${all}`, `${opblock('GET', '/stack', 'Stack tecnológico', '200 OK')}${pipeline}${layers}${tools}`);
}

function experience() {
  const top = BODY_TOP;
  const pad = 26;
  const ex = DATA.experience;
  const textX = pad + 82;
  const textW = W - textX - pad;
  let y = top + 40 + pad + 48; // línea base de la empresa
  let n = 0;
  const groups = ex.groups
    .map((group, gi) => {
      y += gi === 0 ? 40 : 18;
      let markup = `<text x="${pad}" y="${y}" class="mono brand" font-size="11.5" font-weight="600" letter-spacing="1.2"># ${esc(group.title.toUpperCase())}</text>`;
      y += 30;
      group.items.forEach((item) => {
        n += 1;
        const lines = wrapRich(item, textW, 13.5);
        markup += `<text x="${pad}" y="${y}" class="mono" font-size="12">${String(n).padStart(2, '0')}</text><text x="${pad + 30}" y="${y}" class="mono ok" font-size="12">INFO</text>${renderRichLines(lines, textX, y, 21, 'fg', 13.5)}`;
        y += lines.length * 21 + 10;
      });
      return markup;
    })
    .join('');
  const cursorY = y + 4;
  const H = cursorY + pad;
  const body = `${opblock('GET', '/experiencia', 'Experiencia', '200 OK')}
  ${card(0, top, W, H - top, C.console, C.cborder, 12)}
  <path d="M0.5 ${top + 40.5}V${top + 12.5}Q0.5 ${top + 0.5} 12.5 ${top + 0.5}H${W - 12.5}Q${W - 0.5} ${top + 0.5} ${W - 0.5} ${top + 12.5}V${top + 40.5}Z" fill="${C.bar}"/>
  <line x1="0" y1="${top + 40.5}" x2="${W}" y2="${top + 40.5}" stroke="${C.cborder}"/>
  ${icon('terminal', 18, top + 12, 16, C.muted)}<text x="42" y="${top + 25}" class="mono" font-size="12">tail -f experiencia.log</text>
  ${icon('calendar', W - 24 - textWidth(ex.period, 12, MONO_EM) - 22, top + 13, 14, C.ok)}<text x="${W - 24}" y="${top + 25}" text-anchor="end" class="mono ok" font-size="12">${esc(ex.period)}</text>
  <text x="${pad}" y="${top + 40 + pad + 22}" class="fg" font-size="22" font-weight="600">${esc(ex.role)}</text>
  <text x="${pad}" y="${top + 40 + pad + 48}" font-size="14.5">${esc(ex.company)}</text>
  ${groups}
  <text x="${pad}" y="${cursorY}" class="mono" font-size="12">${String(n + 1).padStart(2, '0')}</text>
  <rect x="${pad + 30}" y="${cursorY - 11}" width="7" height="14" fill="${C.brand}" class="cursor"/>`;
  const css = '.cursor { animation: blink 1.1s step-end infinite; } @keyframes blink { 50% { opacity: 0; } } @media (prefers-reduced-motion: reduce) { .cursor { animation: none; } }';
  const plain = ex.groups.map((g) => `${g.title}: ${g.items.join(' ')}`).join(' ');
  return svg(W, H, `GET /experiencia — ${ex.role}, ${ex.company} (${ex.period}). ${plain}`, body, css);
}

function headerOnly(method, path, title, status) {
  return svg(W, SECTION_TOP + HEAD, `${method} ${path} — ${title}`, opblock(method, path, title, status));
}

/** Barra superior de tarjeta de proyecto: GET /proyectos/slug ... 200. `roundRight: false` deja la esquina derecha recta. */
function resourceBar(x, y, w, path, roundRight = true) {
  const r = 12;
  const right = roundRight
    ? `H${x + w - r - 0.5}Q${x + w - 0.5} ${y + 0.5} ${x + w - 0.5} ${y + r + 0.5}V${y + 34.5}`
    : `H${x + w}V${y + 34.5}`;
  return `<path d="M${x + 0.5} ${y + 34.5}V${y + r + 0.5}Q${x + 0.5} ${y + 0.5} ${x + r + 0.5} ${y + 0.5}${right}Z" fill="${C.bar}"/>
  <line x1="${x}" y1="${y + 34.5}" x2="${x + w}" y2="${y + 34.5}" stroke="${C.cborder}"/>
  <rect x="${x + 14}" y="${y + 9}" width="34" height="18" rx="4" fill="none" stroke="rgba(0,180,216,0.5)"/>
  <text x="${x + 31}" y="${y + 22}" text-anchor="middle" class="mono" font-size="10.5" font-weight="600" fill="${C.get}">GET</text>
  <text x="${x + 58}" y="${y + 22}" class="mono" font-size="11.5">${esc(path)}</text>
  <text x="${x + w - 14}" y="${y + 22}" text-anchor="end" class="mono ok" font-size="11.5">200</text>`;
}

function badge(x, y, iconName, text, color, fill) {
  const w = textWidth(text, 11.5, SANS_BOLD_EM) + 40;
  return { w, markup: `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="23" rx="11.5" fill="${fill}" stroke="${color}" stroke-opacity="0.45"/>${icon(iconName, x + 10, y + 5, 13, color)}<text x="${x + 29}" y="${y + 16}" font-size="11.5" font-weight="600" fill="${color}">${esc(text)}</text>` };
}

function projectFeatured(p) {
  const cw = 400;
  const json = jsonLines({ id: p.slug, rol: p.role, stack: p.stack.map(([, n]) => n), repo: p.repo, demo: p.demo });
  const consoleH = 34 + 18 + json.length * 15 + 14;
  const contentX = cw + 28;
  const contentW = W - contentX - 26;
  const titleLines = wrapRich(p.title, contentW, 22, SANS_BOLD_EM);
  const descLines = wrapRich(p.description, contentW, 14);
  let y = 26;
  const b1 = badge(contentX, y, 'star', 'Destacado', C.brand, '#1a1a2a');
  const b2 = badge(contentX + b1.w + 8, y, 'user-round-cog', p.role, C.ok, '#10291f');
  y += 46;
  const title = renderRichLines(titleLines, contentX, y, 28, 'fg', 22, 600);
  y += (titleLines.length - 1) * 28 + 28;
  const desc = renderRichLines(descLines, contentX, y, 22, 'soft', 14);
  y += (descLines.length - 1) * 22 + 22;
  const chips = chipRows(p.stack, contentX, y, contentW);
  y += chips.height + 24;
  const H = Math.max(consoleH, y);
  const body = `${card(0, 0, W, H)}
  <path d="M0.5 12.5Q0.5 0.5 12.5 0.5H${cw}V${H - 0.5}H12.5Q0.5 ${H - 0.5} 0.5 ${H - 12.5}Z" fill="${C.console}"/>
  ${resourceBar(0, 0, cw, `/proyectos/${p.slug}`, false)}
  ${json.map((line, i) => `<text x="18" y="${34 + 26 + i * 15}" class="mono" font-size="11" xml:space="preserve">${line}</text>`).join('')}
  ${card(cw - 74, H - 74, 56, 56, C.bar, C.cborder, 12)}${icon(p.icon, cw - 60, H - 60, 28, p.accent)}
  <line x1="${cw + 0.5}" y1="0" x2="${cw + 0.5}" y2="${H}" stroke="${C.border}"/>
  ${b1.markup}${b2.markup}
  ${title}
  ${desc}
  ${chips.markup}`;
  return svg(W, H, `${p.title}. Rol: ${p.role}. ${p.description.replace(/\*\*/g, '')} Stack: ${p.stack.map(([, n]) => n).join(', ')}.`, body);
}

function projectCard(p, [index, count], height) {
  const { slotW, cardW: w, x } = slot(index, count);
  const pad = 22;
  const innerW = w - pad * 2;
  let y = 34 + 26;
  let teamMarkup = '';
  if (p.team) {
    const b = badge(pad, y - 4, 'users', p.team, C.muted, C.surface2);
    teamMarkup = b.markup;
    y += 30;
  }
  const titleLines = wrapRich(p.title, innerW - 64, 17.5, SANS_BOLD_EM);
  const descLines = wrapRich(p.description, innerW, 13.5);
  const titleY = y + 12;
  y = titleY + (titleLines.length - 1) * 24 + 26;
  const descY = y;
  y += (descLines.length - 1) * 21 + 22;
  const chips = chipRows(p.stack, pad, y, innerW);
  y += chips.height + pad;
  const H = height ?? y;
  const body = `<g transform="translate(${x} 0)">${card(0, 0, w, H)}
  ${resourceBar(0, 0, w, `/proyectos/${p.slug}`)}
  ${card(w - pad - 44, 48, 44, 44, C.console, C.cborder, 10)}${icon(p.icon, w - pad - 33, 59, 22, p.accent)}
  ${teamMarkup}
  ${renderRichLines(titleLines, pad, titleY, 24, 'fg', 17.5, 600)}
  ${renderRichLines(descLines, pad, descY, 21, 'soft', 13.5)}
  ${chips.markup}</g>`;
  return { height: y, svg: svg(slotW, H,`${p.title}${p.team ? ` (${p.team})` : ''}. ${p.description} Stack: ${p.stack.map(([, n]) => n).join(', ')}.`, body) };
}

function contact() {
  const top = BODY_TOP;
  const pad = 24;
  const textLines = wrapRich(DATA.contactText, 360, 15);
  const json = jsonLines(DATA.contactJson);
  const box = { x: 420, y: top + pad, w: W - 420 - pad, h: 34 + 16 + json.length * 16 + 12 };
  const H = top + pad + Math.max(box.h, textLines.length * 25 + 20) + pad;
  const body = `${opblock('POST', '/contacto', 'Contacto', '201 Created')}
  ${card(0, top, W, H - top)}
  ${renderRichLines(textLines, pad, top + pad + 22, 25, 'soft', 15)}
  ${card(box.x, box.y, box.w, box.h, C.console, C.cborder, 10)}
  <path d="M${box.x + 0.5} ${box.y + 32.5}V${box.y + 10.5}Q${box.x + 0.5} ${box.y + 0.5} ${box.x + 10.5} ${box.y + 0.5}H${box.x + box.w - 10.5}Q${box.x + box.w - 0.5} ${box.y + 0.5} ${box.x + box.w - 0.5} ${box.y + 10.5}V${box.y + 32.5}Z" fill="${C.bar}"/>
  <line x1="${box.x}" y1="${box.y + 32.5}" x2="${box.x + box.w}" y2="${box.y + 32.5}" stroke="${C.cborder}"/>
  <text x="${box.x + 14}" y="${box.y + 21}" class="mono" font-size="11">Respuesta</text>
  <text x="${box.x + box.w - 14}" y="${box.y + 21}" text-anchor="end" class="mono ok" font-size="11">201 Created</text>
  ${json.map((line, i) => `<text x="${box.x + 16}" y="${box.y + 34 + 22 + i * 16}" class="mono" font-size="11.5" xml:space="preserve">${line}</text>`).join('')}`;
  return svg(W, H, `POST /contacto — ${DATA.contactText} Email: ${DATA.contactJson.email}. LinkedIn: ${DATA.contactJson.linkedin}.`, body);
}

/* -------------------------------------------------------------------------- */

await loadIcons();
await mkdir(OUT, { recursive: true });

const files = {
  'hero.svg': hero(),
  'about.svg': about(),
  'stack.svg': stack(),
  'experience.svg': experience(),
  'h-proyectos.svg': headerOnly('GET', '/proyectos', 'Proyectos', '200 OK'),
  'h-monitor.svg': headerOnly('GET', '/monitor', 'Actividad en GitHub', '200 OK'),
  'contact.svg': contact(),
};
DATA.buttons.forEach((b) => { files[b.file] = button(b); });

const [featured, ...rest] = DATA.projects;
files[`project-${featured.slug}.svg`] = projectFeatured(featured);
// Grilla de 2 columnas: las dos tarjetas de cada fila tienen el mismo alto.
for (let i = 0; i < rest.length; i += 2) {
  const row = rest.slice(i, i + 2);
  const height = Math.max(...row.map((p, j) => projectCard(p, [j, 2]).height));
  row.forEach((p, j) => { files[`project-${p.slug}.svg`] = projectCard(p, [j, 2], height).svg; });
}

for (const [file, content] of Object.entries(files)) {
  await writeFile(join(OUT, file), content);
  console.log(`  assets/${file}`);
}
