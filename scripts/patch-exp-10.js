const fs=require('fs');
let txt=fs.readFileSync('src/content/site-content.ts','utf8');
const oldExp = `  {
    id: "exp-001",
    role: "Fullstack Developer",
      company: "Automotive parts manufacturer — Philippines",
    period: "Oct 2025 — Present",
    outcomes: [
      "Built and deployed 3 production enterprise applications used by 800+ employees, owning requirements analysis, system design, full-stack development, deployment, and production support.",
      "Enterprise Invoice & EIS Integration — Maintained a legacy enterprise invoice-processing system integrated with an external electronic invoicing API, troubleshooting production issues across authentication, invoice processing, and data validation.",
      "Diagnosed failures through code, database, API, and documentation analysis; implemented and validated targeted fixes using unit, system, integration, and end-user testing.",
      "Managed integration credentials, certificates, sandbox configuration, and technical coordination with external developers and platform support; deployed validated fixes to IIS and documented production incidents.",
      "Developed an employee self-service portal with 60+ RESTful API endpoints, integrating enterprise HR data and cross-application SSO.",
      "Built a transportation reimbursement platform with map-verified routes, Supervisor → Manager → DGM approval workflows, PDF generation, and analytics dashboards.",
      "Built an environmental compliance monitoring system that evaluates wastewater measurements against regulatory standards, automatically classifies results as Pass/Fail/Critical, maintains audit history, and triggers notifications for critical values.",
      "Implemented JWT authentication, role-based access control, audit logging, and automated unit/integration testing across production applications.",
      "Established CI/CD pipelines using GitHub Actions and deployed production applications through IIS.",
    ],`;
const newExp = `  {
    id: "exp-001",
    role: "Fullstack Developer",
      company: "Automotive parts manufacturer — Philippines",
    period: "Oct 2025 — Present",
    outcomes: [
      "Built and deployed 3 production enterprise applications used by 800+ employees, contributing across requirements analysis, system design, development, testing, deployment, and production support.",
      "Maintained a legacy enterprise invoice-processing system integrated with an external electronic invoicing API, diagnosing production failures across authentication, invoice processing, and data validation.",
      "Diagnosed integration issues through code, database, API, and documentation analysis; implemented and validated fixes through unit, integration, system, and end-user testing, coordinating with external developers and platform support.",
      "Developed an Employee Self-Service Portal with 60+ REST API endpoints, enterprise HR-data integration, cross-application SSO, JWT authentication, role-based authorization, and Redis caching.",
      "Built a Transportation Reimbursement System with map-verified routes, multi-level approval workflows, PDF/Excel generation, dashboards, and real-time notifications.",
      "Developed an Environmental Compliance Monitoring System that evaluates wastewater measurements against regulatory and internal standards, automatically classifies results, maintains audit history, and triggers critical-value notifications.",
      "Implemented application security using JWT, HttpOnly cookies, RBAC, CSRF protection, refresh-token rotation, password hashing, and rate limiting.",
      "Automated builds and deployments using GitHub Actions and deployed ASP.NET Core applications through IIS.",
    ],`;

if(txt.includes('Enterprise Invoice & EIS Integration — Maintained a legacy')) {
  txt = txt.replace(oldExp, newExp);
  // patch exp-002
  txt = txt.replace(
    `    outcomes: [
      "Delivered end-to-end full-stack applications for clients, translating business requirements into technical specifications, system architecture, and production-ready solutions.",
      "Designed database schemas and application architecture based on client workflows, data requirements, and expected usage.",
      "Developed responsive web applications using React, Next.js, and TypeScript, implementing frontend interfaces, application logic, API integrations, and data-driven features.",
      "Managed the complete development lifecycle, including requirements gathering, development, testing, deployment, and post-launch maintenance.",
      "Deployed and maintained production applications on Vercel, supporting real end users and addressing issues throughout the application's lifecycle.",
    ],`,
    `    outcomes: [
      "Translated client requirements into technical specifications, application designs, and production-ready web applications.",
      "Developed and deployed applications using React, Next.js, TypeScript, Tailwind CSS, and REST APIs.",
    ],`
  );
  txt = txt.replace(
    `    outcomes: [
      "Digitized manual, paper-based health office workflows, replacing paper records and manual data entry with internal software systems.",
      "Developed an inventory management system using HTML, CSS, JavaScript, and PHP, with automated inventory counting and centralized stock tracking.",
      "Replaced manual inventory calculations with automated quantity tracking, improving consistency and reducing repetitive data entry.",
      "Packaged and deployed the system as a desktop application using Electron, enabling health office personnel to use the system directly on their work computers.",
      "Deployed the application for actual day-to-day operational use, refining features and resolving issues based on user feedback and workflow requirements.",
    ],`,
    `    outcomes: [
      "Replaced manual workflows with internal software systems that centralized operational records and reduced repetitive data entry.",
      "Developed and deployed an inventory management system using JavaScript, PHP, and Electron.",
    ],`
  );
  fs.writeFileSync('src/content/site-content.ts', txt);
  console.log('patched exp 10/10');
} else console.log('not found');
