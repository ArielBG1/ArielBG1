<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/header-dark.svg" />
  <img src="./assets/header-light.svg" width="100%" alt="GET /api/v1/ariel-bogado · 200 OK — Ariel Bogado, Backend Developer · C# / .NET" />
</picture>

<a href="https://arielbogado.vercel.app"><img src="https://img.shields.io/badge/GET-portafolio-512BD4?style=for-the-badge&labelColor=085A75" alt="GET portafolio" /></a>
<a href="https://www.linkedin.com/in/arielbogadogimenez"><img src="https://img.shields.io/badge/GET-linkedin-0A66C2?style=for-the-badge&labelColor=085A75" alt="GET linkedin" /></a>
<a href="mailto:arielbogadogimenez@gmail.com"><img src="https://img.shields.io/badge/POST-email-13131F?style=for-the-badge&labelColor=065F46" alt="POST email" /></a>

</div>

<br />

Mi portafolio es una API, y este perfil también. Esta es la respuesta real de `GET /api/v1/es/perfil.json`:

```http
GET /api/v1/es/perfil.json HTTP/1.1
Host: arielbogado.vercel.app
Accept: application/json
```

```json
{
  "nombre": "Ariel Bogado",
  "rol": "Backend Developer",
  "ubicacion": "Paraguay",
  "perfil": [
    "Backend Developer | C# · .NET",
    "APIs REST · PostgreSQL · SQL Server",
    "Frontend con React + Tailwind",
    "Estudiante de Ingeniería Informática"
  ],
  "intereses": [
    "IA aplicada",
    "Sistemas distribuidos"
  ]
}
```

<details open>
<summary><img src="./assets/get.svg" height="20" align="top" alt="GET" /> <b><code>/sobre-mi</code></b> · Sobre mí</summary>
<br />

Desarrollador backend con más de 2 años de experiencia en C# y .NET, enfocado en el desarrollo y mantenimiento de sistemas en producción para la gestión universitaria. Experiencia en bases de datos PostgreSQL y SQL Server, APIs REST, relevamiento de requerimientos y coordinación de equipos de desarrollo, además de desarrollo frontend con React, Tailwind CSS y Bootstrap. Estudiante de 5.º año de Ingeniería Informática, con interés en IA aplicada y sistemas distribuidos.

- <img src="https://api.iconify.design/lucide/building-2.svg?color=%237C6CF2" height="16" /> **Software Developer en UNIDA**: desarrollo y mantengo la plataforma universitaria en .NET, relevo requerimientos con las áreas usuarias y lidero al equipo de desarrollo
- <img src="https://api.iconify.design/lucide/briefcase.svg?color=%237C6CF2" height="16" /> Proyectos **freelance**: sistemas de gestión, punto de venta e inventario
- <img src="https://api.iconify.design/lucide/graduation-cap.svg?color=%237C6CF2" height="16" /> Estudiante de 5.º año de **Ingeniería Informática**
- <img src="https://api.iconify.design/lucide/brain-circuit.svg?color=%237C6CF2" height="16" /> Me interesan la **IA aplicada** y los **sistemas distribuidos**
- <img src="https://api.iconify.design/lucide/map-pin.svg?color=%237C6CF2" height="16" /> Paraguay

</details>

<details open>
<summary><img src="./assets/get.svg" height="20" align="top" alt="GET" /> <b><code>/stack</code></b> · Stack tecnológico</summary>
<br />

<table>
  <tr>
    <td align="center"><b>Frontend</b></td>
    <td><img src="https://skillicons.dev/icons?i=react,vite,tailwind,bootstrap,js,html,css" alt="React, Vite, Tailwind CSS, Bootstrap, JavaScript, HTML, CSS" /></td>
  </tr>
  <tr>
    <td align="center"><b>Backend</b></td>
    <td><img src="https://skillicons.dev/icons?i=cs,dotnet,nodejs,express,java,spring,py,flask,fastapi" alt="C#, .NET, Node.js, Express, Java, Spring Boot, Python, Flask, FastAPI" /></td>
  </tr>
  <tr>
    <td align="center"><b>Bases de datos</b></td>
    <td>
      <img src="https://skillicons.dev/icons?i=postgres,mysql" alt="PostgreSQL, MySQL" />
      <img height="48" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" alt="SQL Server" />
      <img height="48" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg" alt="Oracle" />
    </td>
  </tr>
  <tr>
    <td align="center"><b>Herramientas</b></td>
    <td><img src="https://skillicons.dev/icons?i=docker,git,github,visualstudio,vscode,postman" alt="Docker, Git, GitHub, Visual Studio, VS Code, Postman" /></td>
  </tr>
</table>

</details>

<details open>
<summary><img src="./assets/get.svg" height="20" align="top" alt="GET" /> <b><code>/experiencia</code></b> · Experiencia</summary>
<br />

**Software Developer** · Universidad de la Integración de las Américas (UNIDA)<br />
<sub><code>2024-04 → presente</code></sub>

**Desarrollo**

- Desarrollo nuevas funcionalidades y realizo el mantenimiento de la plataforma universitaria en C# con ASP.NET MVC y ASP.NET Core (.NET 10).
- Construyo módulos y APIs REST a medida para distintas áreas de la universidad, desde el modelado de datos hasta la integración con otros sistemas.
- Modelo bases de datos en SQL Server y optimizo el acceso a datos mediante consultas SQL y LINQ.
- Diagnostico y corrijo incidencias en producción, y automatizo procesos internos para reducir tareas manuales.

**Liderazgo y análisis**

- Relevo requerimientos con las distintas áreas de la universidad, los analizo y defino el alcance de cada desarrollo.
- Planifico y distribuyo las tareas del equipo de desarrollo según prioridades, bajo la supervisión de la Jefatura de Sistemas.
- Reviso el trabajo entregado por el equipo y hago seguimiento del cumplimiento de plazos.
- Valido las entregas con los usuarios y elaboro documentación técnica de los sistemas.

</details>

<details open>
<summary><img src="./assets/get.svg" height="20" align="top" alt="GET" /> <b><code>/proyectos</code></b> · Proyectos</summary>
<br />

<table>
<tr>
<td colspan="2">

### <img src="https://api.iconify.design/lucide/recycle.svg?color=%2310B981" height="20" /> Cyclo — Plataforma de economía circular
<sub><code>GET /proyectos/cyclo</code> · <b>Rol:</b> Desarrollador full stack · Líder técnico</sub>

App ciudadana de reciclaje con mapa interactivo, reconocimiento de materiales por cámara (CycloScan) y gamificación con validación por geolocalización. Disponible en español, inglés y coreano. Lideré el desarrollo en el **Global Green Challenge**, junto a INHA University (Corea del Sur).

<img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,postgres,tensorflow" height="36" alt="React, Vite, Tailwind CSS, Node.js, Express, PostgreSQL + PostGIS, TensorFlow.js" />

[![Demo](https://img.shields.io/badge/Demo_en_vivo-512BD4?style=for-the-badge&logo=vercel&logoColor=white)](https://cyclo-nine.vercel.app)
[![Repo](https://img.shields.io/badge/Repositorio-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ArielBG1/Cyclo)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### <img src="https://api.iconify.design/lucide/shopping-cart.svg?color=%237C6CF2" height="20" /> DespensaAPP — POS e inventario
<sub><code>GET /proyectos/despensa-app</code></sub>

Punto de venta e inventario para comercio minorista: lector de código de barras, productos por peso, compras, auditoría de stock y roles.

<img src="https://skillicons.dev/icons?i=cs,dotnet,postgres" height="36" alt="C#, .NET, PostgreSQL" />

[![Repo](https://img.shields.io/badge/Ver_repositorio-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/ArielBG1/DespensaAPP)

</td>
<td width="50%" valign="top">

### <img src="https://api.iconify.design/lucide/scan-face.svg?color=%237C6CF2" height="20" /> Asistencia con reconocimiento facial
<sub><code>GET /proyectos/facial-attendance</code></sub>

Marcación docente que valida ventana horaria, proximidad GPS (100 m) e identidad facial con anti-spoofing usando DeepFace y SQL Server.

<img src="https://skillicons.dev/icons?i=py,flask,opencv" height="36" alt="Python, Flask, OpenCV" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" height="36" alt="SQL Server" />

[![Repo](https://img.shields.io/badge/Ver_repositorio-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/ArielBG1/sistema_marcacion_docente)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### <img src="https://api.iconify.design/lucide/ticket.svg?color=%237C6CF2" height="20" /> Soporte por tickets
<sub><code>GET /proyectos/ticket-support</code> · Proyecto en equipo</sub>

Sistema de mesa de ayuda para registrar y dar seguimiento a tickets de soporte.

<img src="https://skillicons.dev/icons?i=nodejs,js" height="36" alt="Node.js, JavaScript" />

[![Repo](https://img.shields.io/badge/Ver_repositorio-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/ArielBG1/soporte_ticket)

</td>
<td width="50%" valign="top">

### <img src="https://api.iconify.design/lucide/layout-template.svg?color=%237C6CF2" height="20" /> Torotech — Landing Page
<sub><code>GET /proyectos/torotech-landing</code></sub>

Landing page para Torotech, la plataforma educativa del Instituto Técnico Superior Santa María del Rosario (ITSSMAR).

<img src="https://skillicons.dev/icons?i=html,css" height="36" alt="HTML, CSS" />

[![Repo](https://img.shields.io/badge/Ver_repositorio-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/ArielBG1/Torotech-LandingPage)

</td>
</tr>
</table>

</details>

<details open>
<summary><img src="./assets/get.svg" height="20" align="top" alt="GET" /> <b><code>/monitor</code></b> · Actividad en GitHub</summary>
<br />

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ArielBG1/ArielBG1/output/api-monitor.svg" />
    <img src="https://raw.githubusercontent.com/ArielBG1/ArielBG1/output/api-monitor-light.svg" width="100%" alt="API monitor: mis contribuciones en GitHub de los últimos 12 meses como requests por día, con total, racha actual, racha máxima y día pico" />
  </picture>
  <br /><br />
  <img height="165" src="./profile/top-langs.svg" alt="Lenguajes más usados" />
</div>

</details>

<details open>
<summary><img src="./assets/post.svg" height="20" align="top" alt="POST" /> <b><code>/contacto</code></b> · Contacto</summary>
<br />

¿Tenés una propuesta de trabajo o un proyecto freelance en mente? Escribime y te respondo a la brevedad.

- <img src="https://api.iconify.design/lucide/mail.svg?color=%237C6CF2" height="16" /> [arielbogadogimenez@gmail.com](mailto:arielbogadogimenez@gmail.com)
- <img src="https://api.iconify.design/lucide/linkedin.svg?color=%237C6CF2" height="16" /> [linkedin.com/in/arielbogadogimenez](https://www.linkedin.com/in/arielbogadogimenez)
- <img src="https://api.iconify.design/lucide/globe.svg?color=%237C6CF2" height="16" /> [arielbogado.vercel.app](https://arielbogado.vercel.app)

O pedile los datos a mi API:

```bash
curl https://arielbogado.vercel.app/api/v1/es/contacto.json
```

</details>

<br />

<img src="./assets/footer.svg" width="100%" alt="PS C:\ariel-bogado> whoami → ariel-bogado" />
