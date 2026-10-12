const fs=require('fs');
let txt=fs.readFileSync('src/content/site-content.ts','utf8');

// Patch experience outcomes
const oldOutcomes = `    outcomes: [
      "Built and deployed 3 production enterprise applications used by 800+ employees, owning requirements analysis, system design, full-stack development, deployment, and production support.",
      "Developed an employee self-service portal with 60+ RESTful API endpoints, integrating enterprise HR data and cross-application SSO.",
      "Built a transportation reimbursement platform with map-verified routes, Supervisor → Manager → DGM approval workflows, PDF generation, and analytics dashboards.",
      "Built an environmental compliance monitoring system that evaluates wastewater measurements against regulatory standards, automatically classifies results as Pass/Fail/Critical, maintains audit history, and triggers notifications for critical values.",
      "Took ownership of the company's BIR EIS integration, resolving a critical production issue and providing ongoing technical support. Worked directly with the external development team on Microsoft Dynamics 365 integration, troubleshooting issues, providing technical guidance, and developing sandbox applications for integration testing.",
      "Implemented JWT authentication, role-based access control, audit logging, and automated unit/integration testing across production applications.",
      "Established CI/CD pipelines using GitHub Actions and deployed production applications through IIS.",
    ],`;

const newOutcomes = `    outcomes: [
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

if(txt.includes('Took ownership of the company')) {
  txt=txt.replace(oldOutcomes, newOutcomes);
  console.log('patched experience outcomes');
} else console.log('not found old outcomes');

// Patch CV detail
const oldCvDetail = `        detail: "Built and deployed 3 production enterprise applications used by 800+ employees across requirements analysis, system design, development, testing, deployment, and production support. Developed an Employee Self-Service Portal with 60+ RESTful API endpoints, integrating enterprise HR data, JWT authentication, Redis caching, and cross-application SSO. Built a Transportation Reimbursement System with map-verified routes, multi-level approval workflows, PDF/Excel generation, dashboards, and real-time notifications. Developed an Environmental Compliance Monitoring System that evaluates wastewater measurements against regulatory standards and automatically classifies results as Pass/Fail/Critical, with audit history and critical-value notifications. Resolved a critical BIR EIS integration issue with Microsoft Dynamics 365, becoming the primary internal support contact. Implemented application security using JWT, HttpOnly cookies, role-based authorization, CSRF protection, refresh-token rotation, password hashing, and rate limiting. Established CI/CD pipelines using GitHub Actions and deployed through IIS."`;

const newCvDetail = `        detail: "Built and deployed 3 production enterprise applications used by 800+ employees across requirements analysis, system design, development, testing, deployment, and production support. Enterprise Invoice & EIS Integration — Maintained a legacy enterprise invoice-processing system integrated with an external electronic invoicing API, troubleshooting production issues across authentication, invoice processing, and data validation. Diagnosed failures through code, database, API, and documentation analysis; implemented and validated targeted fixes using unit, system, integration, and end-user testing. Managed integration credentials, certificates, sandbox configuration, and technical coordination with external developers and platform support; deployed validated fixes to IIS and documented production incidents. Developed an Employee Self-Service Portal with 60+ RESTful API endpoints, integrating enterprise HR data, JWT authentication, Redis caching, and cross-application SSO. Built a Transportation Reimbursement System with map-verified routes, multi-level approval workflows, PDF/Excel generation, dashboards, and real-time notifications. Developed an Environmental Compliance Monitoring System that evaluates wastewater measurements against regulatory standards and automatically classifies results as Pass/Fail/Critical, with audit history and critical-value notifications. Implemented application security using JWT, HttpOnly cookies, role-based authorization, CSRF protection, refresh-token rotation, password hashing, and rate limiting. Established CI/CD pipelines using GitHub Actions and deployed through IIS."`;

if(txt.includes('Resolving a critical BIR EIS')) {
  // the oldCvDetail is inside cvSections, find and replace the specific substring
  txt=txt.replace(oldCvDetail, newCvDetail);
  console.log('patched cv detail');
} else {
  // try alternative search
  if(txt.includes('Resolving a critical BIR EIS integration issue')){
    txt=txt.replace('Resolving a critical BIR EIS integration issue with Microsoft Dynamics 365, becoming the primary internal support contact.', 'Enterprise Invoice & EIS Integration — Maintained a legacy enterprise invoice-processing system integrated with an external electronic invoicing API, troubleshooting production issues across authentication, invoice processing, and data validation. Diagnosed failures through code, database, API, and documentation analysis; implemented and validated targeted fixes using unit, system, integration, and end-user testing. Managed integration credentials, certificates, sandbox configuration, and technical coordination with external developers and platform support; deployed validated fixes to IIS and documented production incidents.');
    console.log('patched cv detail alternative');
  } else console.log('cv detail not found');
}

fs.writeFileSync('src/content/site-content.ts', txt);
console.log('done');
