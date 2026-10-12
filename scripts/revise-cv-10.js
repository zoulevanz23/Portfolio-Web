const fs=require('fs');

const newCv = [
  {
    id: "summary",
    title: "Professional Summary",
    items: [
      {
        label: "",
        detail: "Software Engineer experienced in building, deploying, and supporting production enterprise applications. Built and shipped 3 systems used by 800+ employees, with hands-on experience across system design, full-stack development, REST APIs, database design, application security, testing, CI/CD, and production support. Strongest in C#, ASP.NET Core, React, TypeScript, and SQL Server, with additional experience in enterprise integrations, developer security tooling, and AI applications."
      }
    ]
  },
  {
    id: "experience",
    title: "Experience",
    items: [
      {
        label: "Fullstack Developer — Automotive parts manufacturer, Philippines",
        period: "Oct 2025 — Present",
        detail: "Built and deployed 3 production enterprise applications used by 800+ employees, contributing across requirements analysis, system design, development, testing, deployment, and production support. Maintained a legacy enterprise invoice-processing system integrated with an external electronic invoicing API, diagnosing production failures across authentication, invoice processing, and data validation. Diagnosed integration issues through code, database, API, and documentation analysis; implemented and validated fixes through unit, integration, system, and end-user testing, coordinating with external developers and platform support. Developed an Employee Self-Service Portal with 60+ REST API endpoints, enterprise HR-data integration, cross-application SSO, JWT authentication, role-based authorization, and Redis caching. Built a Transportation Reimbursement System with map-verified routes, multi-level approval workflows, PDF/Excel generation, dashboards, and real-time notifications. Developed an Environmental Compliance Monitoring System that evaluates wastewater measurements against regulatory and internal standards, automatically classifies results, maintains audit history, and triggers critical-value notifications. Implemented application security using JWT, HttpOnly cookies, RBAC, CSRF protection, refresh-token rotation, password hashing, and rate limiting. Automated builds and deployments using GitHub Actions and deployed ASP.NET Core applications through IIS."
      },
      {
        label: "Freelance Fullstack Developer — Self-Employed",
        period: "May 2025 — Sept 2025",
        detail: "Translated client requirements into technical specifications, application designs, and production-ready web applications. Developed and deployed applications using React, Next.js, TypeScript, Tailwind CSS, and REST APIs."
      },
      {
        label: "System Development Intern — Municipal Health Office",
        period: "Feb 2025 — May 2025",
        detail: "Replaced manual workflows with internal software systems that centralized operational records and reduced repetitive data entry. Developed and deployed an inventory management system using JavaScript, PHP, and Electron."
      }
    ]
  },
  {
    id: "projects",
    title: "Personal Projects",
    items: [
      {
        label: "Cipher — Developer Security & Vulnerability Analysis Tool",
        detail: "Python, FastAPI, React, TypeScript, SQLite, VS Code Extension API. Built a dependency vulnerability analysis tool integrating OSV, NIST NVD, GitHub Advisory, npm, and PyPI vulnerability data. Developed a FastAPI backend, React interface, and VS Code extension with inline diagnostics and SARIF integration for CI workflows."
      },
      {
        label: "SmartWay — AI Study Companion",
        detail: "React, TypeScript, Vite, Node.js, Express, Supabase, Google Gemini API. Built an AI study platform that transforms PDF, Word, and text documents into summaries, flashcards, and quizzes. Implemented file validation, cloud storage, input constraints, and production deployment."
      },
      {
        label: "TruthCheck AI — AI Scam & Misinformation Analyzer",
        detail: "React, TypeScript, Node.js, Express, Google Gemini API. Built an application for analyzing messages, links, and articles for potential scams, phishing, and misinformation. Implemented input validation, rate limiting, CORS controls, security headers, and privacy-focused no-login usage."
      }
    ]
  },
  {
    id: "skills",
    title: "Technical Skills",
    items: [
      { label: "Programming", detail: "C#, TypeScript, JavaScript, Python, SQL, PHP" },
      { label: "Frontend", detail: "React, Next.js, Vite, Tailwind CSS, Redux Toolkit, TanStack Query" },
      { label: "Backend", detail: "ASP.NET Core, .NET 8, Entity Framework Core, FastAPI, Node.js, Express, REST APIs, SignalR" },
      { label: "Databases & Infrastructure", detail: "SQL Server, SQLite, Redis, Docker, IIS" },
      { label: "Testing & Security", detail: "xUnit, Moq, Vitest, React Testing Library, JWT, RBAC, CSRF, BCrypt, Rate Limiting" },
      { label: "DevOps & Integrations", detail: "GitHub Actions, Microsoft Dynamics 365, BIR EIS, Google Gemini API, OSV, NIST NVD, GitHub, npm, PyPI" }
    ]
  },
  {
    id: "certifications",
    title: "Certifications",
    items: [
      { label: "Foundational C# with Microsoft – Developer Certification", detail: "freeCodeCamp & Microsoft", period: "Nov 2025" },
      { label: "JavaScript Essentials 2", detail: "Cisco Networking Academy & OpenEDG", period: "Aug 2026" },
      { label: "JavaScript Essentials 1", detail: "Cisco Networking Academy", period: "Jun 2025" },
      { label: "Endpoint Security", detail: "Cisco", period: "Nov 2024" },
      { label: "Cyber Threat Management", detail: "Cisco", period: "Nov 2024" },
      { label: "Getting Started with Generative AI", detail: "IBM SkillsBuild", period: "Sep 2026" }
    ]
  },
  {
    id: "education",
    title: "Education",
    items: [
      { label: "B.S. Information Systems — Batangas State University", detail: "Focus on software engineering and systems analysis.", period: "2021 — 2025" }
    ]
  }
];

fs.writeFileSync('src/data/cvSections.json', JSON.stringify(newCv, null, 2));
console.log('wrote cvSections.json', newCv.length);

// patch site-content.ts
let txt = fs.readFileSync('src/content/site-content.ts','utf8');
const startMarker = 'export const cvSections: CVSection[] = [';
const endMarker = '\n];\n\n// --- LIVE SYSTEM LAB ---';
const idxStart = txt.indexOf(startMarker);
const idxEnd = txt.indexOf(endMarker, idxStart);
if(idxStart===-1 || idxEnd===-1) { console.log('markers not found'); process.exit(1); }
const before = txt.slice(0, idxStart);
const after = txt.slice(idxEnd);
const newBlock = 'export const cvSections: CVSection[] = ' + JSON.stringify(newCv, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, '"') + ';';
 // JSON.stringify already gives correct, but we need to keep TS style: keys without quotes is okay but with quotes also valid. We'll just inject JSON as JS.
 // Simpler: generate TS literal via manual
let tsLiteral = 'export const cvSections: CVSection[] = [\n';
newCv.forEach(sec=>{
  tsLiteral += `  {\n    id: "${sec.id}",\n    title: "${sec.title}",\n    items: [\n`;
  sec.items.forEach(it=>{
    tsLiteral += `      {\n        label: ${JSON.stringify(it.label)},\n        detail: ${JSON.stringify(it.detail)}${it.period ? `,\n        period: ${JSON.stringify(it.period)}` : ''}\n      },\n`;
  });
  tsLiteral += `    ],\n  },\n`;
});
tsLiteral += '];';
txt = before + tsLiteral + after;
fs.writeFileSync('src/content/site-content.ts', txt);
console.log('patched site-content.ts');
