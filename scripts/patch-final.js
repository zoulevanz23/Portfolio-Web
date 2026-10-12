const fs=require('fs');

// Update cvSections.json and experience.json
let cv=JSON.parse(fs.readFileSync('src/data/cvSections.json','utf8'));
let exp=JSON.parse(fs.readFileSync('src/data/experience.json','utf8'));

// Summary
cv.find(s=>s.id==='summary').items[0].detail = "Software Engineer experienced in building, deploying, and supporting production enterprise applications. Hands-on experience across system design, full-stack development, REST APIs, database design, application security, testing, CI/CD, and production support. Strongest in C#, ASP.NET Core, React, TypeScript, and SQL Server, with experience delivering secure enterprise systems, external integrations, and production deployments.";

// Experience - combine EIS into 2 strong bullets per latest feedback
exp[0].outcomes = [
  "Built and deployed 3 production enterprise applications serving 800+ employees, owning development across requirements analysis, system design, implementation, testing, deployment, and production support.",
  "Diagnosed and resolved production failures in a legacy enterprise invoice-processing system integrated with an external electronic invoicing API, tracing issues across application code, database state, API behavior, authentication, and external documentation.",
  "Coordinated with external developers and platform support to validate fixes, manage integration credentials and certificates, and deploy validated changes through IIS.",
  "Developed an Employee Self-Service Portal used by 800+ employees, with 60+ REST API endpoints, enterprise HR-data integration, cross-application SSO, JWT authentication, role-based authorization, and Redis caching.",
  "Built a Transportation Reimbursement System used by 200+ employees, implementing map-verified routes, multi-level approval workflows, automated PDF/Excel generation, dashboards, and real-time notifications.",
  "Developed an Environmental Compliance Monitoring System that evaluates wastewater measurements against regulatory and internal standards through centralized business rules, automatically classifying results, maintaining audit history, and triggering critical-value notifications.",
  "Implemented application security using JWT, HttpOnly cookies, RBAC, CSRF protection, refresh-token rotation, password hashing, and rate limiting.",
  "Automated application build, test, and deployment workflows using GitHub Actions, deploying ASP.NET Core applications to IIS."
];
exp[1].outcomes = [
  "Translated client requirements into technical specifications, application designs, and production-ready web applications.",
  "Developed and deployed applications using React, Next.js, TypeScript, Tailwind CSS, and REST APIs."
];
exp[2].outcomes = [
  "Replaced manual workflows with internal software systems that centralized operational records and reduced repetitive data entry.",
  "Developed and deployed an inventory management system using JavaScript, PHP, and Electron."
];
fs.writeFileSync('src/data/experience.json', JSON.stringify(exp,null,2));

// Sync cv experience detail
let cvExp = cv.find(s=>s.id==='experience');
cvExp.items[0].detail = exp[0].outcomes.join(" ");
cvExp.items[1].detail = exp[1].outcomes.join(" ");
cvExp.items[2].detail = exp[2].outcomes.join(" ");

// Ensure skills are correct (already simplified, but verify no duplication)
// Keep 6 categories as previously simplified - already correct, just ensure order
let skills = cv.find(s=>s.id==='skills');
skills.items = [
  { label: "Programming", detail: "C#, TypeScript, JavaScript, Python, SQL" },
  { label: "Frontend", detail: "React, Next.js, Vite, Tailwind CSS, Redux Toolkit, TanStack Query" },
  { label: "Backend", detail: "ASP.NET Core, .NET 8, Entity Framework Core, FastAPI, Node.js, REST APIs, SignalR" },
  { label: "Databases & Infrastructure", detail: "SQL Server, SQLite, Redis, Docker, IIS" },
  { label: "Testing & Security", detail: "xUnit, Moq, Vitest, React Testing Library, JWT, RBAC, CSRF, BCrypt" },
  { label: "DevOps & Integrations", detail: "GitHub Actions, Microsoft Dynamics 365, BIR EIS, Google Gemini API, OSV, NIST NVD" }
];

// Ensure projects are 2 only, Cipher first
let proj = cv.find(s=>s.id==='projects');
proj.items = [
  {
    label: "Cipher — Developer Security & Vulnerability Analysis Tool",
    detail: "Python, FastAPI, React, TypeScript, SQLite, VS Code Extension API. Built a dependency vulnerability analysis tool integrating OSV, NIST NVD, GitHub Advisory, npm, and PyPI vulnerability data. Developed a FastAPI backend, React interface, and VS Code extension with inline diagnostics and SARIF integration for CI workflows."
  },
  {
    label: "SmartWay — AI Study Companion",
    detail: "React, TypeScript, Vite, Node.js, Express, Supabase, Google Gemini API. Built an AI study platform that transforms PDF, Word, and text documents into summaries, flashcards, and quizzes. Implemented file validation, cloud storage, input constraints, and production deployment."
  }
];

// Ensure certifications remain 4 curated
let cert = cv.find(s=>s.id==='certifications');
cert.items = [
  { label: "Foundational C# with Microsoft – Developer Certification", detail: "freeCodeCamp & Microsoft", period: "Nov 2025" },
  { label: "JavaScript Essentials 2", detail: "Cisco Networking Academy & OpenEDG", period: "Aug 2026" },
  { label: "Endpoint Security", detail: "Cisco", period: "Nov 2024" },
  { label: "Cyber Threat Management", detail: "Cisco", period: "Nov 2024" }
];

fs.writeFileSync('src/data/cvSections.json', JSON.stringify(cv,null,2));
console.log('patched cvSections and experience json');

// Patch site-content.ts
let txt=fs.readFileSync('src/content/site-content.ts','utf8');

// Patch summary detail
txt = txt.replace(
  /detail:\s*"Software Engineer experienced in building, deploying, and supporting production enterprise applications\. Built and shipped 3 systems used by 800\+ employees[^"]*"/,
  `detail: "Software Engineer experienced in building, deploying, and supporting production enterprise applications. Hands-on experience across system design, full-stack development, REST APIs, database design, application security, testing, CI/CD, and production support. Strongest in C#, ASP.NET Core, React, TypeScript, and SQL Server, with experience delivering secure enterprise systems, external integrations, and production deployments."`
);

// Rebuild cvSections block from cv
let tsLiteral = 'export const cvSections: CVSection[] = [\n';
cv.forEach(sec=>{
  tsLiteral += `  {\n    id: "${sec.id}",\n    title: "${sec.title}",\n    items: [\n`;
  sec.items.forEach(it=>{
    tsLiteral += `      {\n        label: ${JSON.stringify(it.label)},\n        detail: ${JSON.stringify(it.detail)}${it.period ? `,\n        period: ${JSON.stringify(it.period)}` : ''}\n      },\n`;
  });
  tsLiteral += `    ],\n  },\n`;
});
tsLiteral += '];';
const startMarker = 'export const cvSections: CVSection[] = [';
const endMarker = '\n];\n\n// --- LIVE SYSTEM LAB ---';
let idxStart = txt.indexOf(startMarker);
let idxEnd = txt.indexOf(endMarker, idxStart);
if(idxStart!==-1 && idxEnd!==-1){
  const before = txt.slice(0, idxStart);
  const after = txt.slice(idxEnd);
  txt = before + tsLiteral + after;
  console.log('patched cvSections ts');
}

// Patch experience block
let expLiteral = 'export const experience: ExperienceEntry[] = [\n';
exp.forEach(e=>{
  expLiteral += `  {\n    id: "${e.id}",\n    role: "${e.role}",\n      company: "${e.company}",\n    period: "${e.period}",\n    outcomes: [\n`;
  e.outcomes.forEach(o=>{ expLiteral += `      ${JSON.stringify(o)},\n`; });
  expLiteral += `    ],\n    systemIds: [${e.systemIds.map(id=>`"${id}"`).join(', ')}],\n  },\n`;
});
expLiteral += '];';
const expStart = 'export const experience: ExperienceEntry[] = [';
const expEnd = '\n];\n\n// --- STACK ---';
let eIdxStart = txt.indexOf(expStart);
let eIdxEnd = txt.indexOf(expEnd, eIdxStart);
if(eIdxStart!==-1 && eIdxEnd!==-1){
  const beforeE = txt.slice(0, eIdxStart);
  const afterE = txt.slice(eIdxEnd);
  txt = beforeE + expLiteral + afterE;
  console.log('patched experience ts');
}

fs.writeFileSync('src/content/site-content.ts', txt);
console.log('done');
