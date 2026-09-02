// =============================================================================
// CONTENT CONFIG — Replace [PLACEHOLDER] sections with real data
// =============================================================================

export interface SystemNode {
  id: string;
  label: string;
  type: "frontend" | "api" | "database" | "cache" | "queue" | "external";
  details: {
    framework?: string;
    auth?: string;
    dataAccess?: string;
    validation?: string;
    testing?: string;
    notes?: string;
  };
}

export interface System {
  id: string;
  name: string;
  function: string;
  stack: string[];
  status: "production" | "development" | "archived";
  summary: string;
  narrative: string;
  sellingPoints: string[];
  architecture: {
    nodes: SystemNode[];
    connections: { from: string; to: string }[];
  };
}

export interface EngineeringLogEntry {
  id: string;
  title: string;
  date: string;
  problem: string;
  investigation: string;
  rootCause: string;
  solution: string;
  result: string;
  lesson: string;
  relatedSystemId?: string;
}

export interface DecisionLogEntry {
  id: string;
  title: string;
  decision: string;
  why: string;
  alternative: string;
  tradeoff: string;
  relatedSystemId?: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  outcomes: string[];
  systemIds: string[];
}

export interface StackItem {
  name: string;
  category: "core" | "supporting" | "data" | "infra" | "testing" | "integrations" | "ai-exploration";
  tier: 1 | 2 | 3 | 4;
  projectIds: string[];
}

export interface Credential {
  id: string;
  type: "certification" | "badge" | "link";
  title: string;
  issuer?: string;
  url?: string;
  year?: string;
}

export interface CVSection {
  id: string;
  title: string;
  items: { label: string; detail: string; period?: string }[];
}

// --- IDENTITY ---

export const identity = {
  name: "Josh Ivan Sartin",
  role: "Fullstack Developer",
  yearsExperience: "1.5+",
  yearsDevelopment: "2+",
  thesis:
    "I build full-stack systems that turn real-world business processes into reliable, maintainable software.",
  email: "Available on request",
  github: "https://github.com/joshivan",
  linkedin: "https://linkedin.com/in/joshivan",
};

export const proofStrip = [
  { label: "Systems Shipped", value: "3+" },
  { label: "Full-Stack Scope", value: "Frontend → API → DB" },
  { label: "Production Status", value: "2 in production" },
  { label: "Current Stack", value: ".NET 8 / Next.js / TypeScript / SQL Server" },
];

export const now = {
  building: "Employee Portal Phase 2, Wastewater Monitoring System, Transportation Reimbursement System",
  learning: "Data Structures & Algorithms, SQL, API design, system design, Python/FastAPI, testing, cloud/infrastructure",
  exploring: "AI/ML, RAG, LangChain-style frameworks, PyTorch, vector databases, Docker, Kubernetes, AWS/Azure",
};

// --- LIFE OUTSIDE </> ---

export interface LifeOutsideEntry {
  id: string;
  category: "hobby" | "music" | "manhwa" | "blog";
  title: string;
  detail: string;
  url?: string;
}

export const lifeOutside: LifeOutsideEntry[] = [
  {
    id: "lo-hobby-001",
    category: "hobby",
    title: "Running",
    detail: "Running is one of the ways I step away from the screen, build consistency, and measure progress outside of software.",
  },
  {
    id: "lo-hobby-002",
    category: "hobby",
    title: "Anime / Reading",
    detail: "Anime and reading are part of how I spend time away from development, especially stories that explore growth, identity, struggle, and becoming better.",
  },
  {
    id: "lo-music-001",
    category: "music",
    title: "Curating focus playlists",
    detail: "Lo-fi and instrumental mixes for deep work — currently curating a personal rotation.",
  },
  {
    id: "lo-manhwa-001",
    category: "manhwa",
    title: "Exploring manhwa",
    detail: "Collecting recommendations — list will be curated here soon.",
  },
];

// --- BLOG ---

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  body: string[];
}

export const blogPosts: BlogPost[] = [];

// --- SYSTEMS ---

export const systems: System[] = [
  {
    id: "sys-001",
    name: "Wastewater Parameter Monitoring System (WWLAB)",
    function: "Monitors wastewater quality parameters and evaluates laboratory measurements against environmental standards.",
    stack: ["React 18", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Recharts", "TanStack Table", "ASP.NET Core 8", "C#", "Entity Framework Core", "SignalR", "Redis", "QuestPDF", "ClosedXML", "MailKit", "SQL Server"],
    status: "production",
    summary:
      "A full-stack environmental compliance system for recording and monitoring wastewater laboratory measurements across multiple monitoring points. The system evaluates measured parameters against defined standards and surfaces Passed, Failed, and Critical results through dashboards and reporting workflows.",
    narrative:
      "I built an end-to-end environmental compliance monitoring platform for Aisin Asia Pacific, a Toyota-group automotive parts manufacturer. The system tracks wastewater parameters across 9 facility sections — discharge, aeration, clarifiers, equalization — with a server-side judgment engine that automatically classifies every reading as Pass, Fail, or Critical against Philippine regulatory and company-internal standards.",
    sellingPoints: [
      "13-table SQL Server schema with temporal tables for audit compliance",
      "Transactional outbox pattern for reliable email notifications",
      "Real-time SignalR dashboards for live monitoring",
      "Async PDF/Excel export via QuestPDF and ClosedXML",
      "Cross-server HR database integration for user registration verification",
      "JWT authentication with BCrypt and external HR database integration",
      "Redis-backed KPI caching with employee-scoped keys",
      "Full audit trail logging with user attribution and IP address tracking",
    ],
    architecture: {
      nodes: [
        {
          id: "fe",
          label: "Web Client",
          type: "frontend",
          details: {
            framework: "React 18 / TypeScript / TailwindCSS / Redux Toolkit",
            auth: "JWT-based authentication",
            validation: "Client-side form validation + server-side API validation",
            testing: "Vitest + React Testing Library + jsdom",
          },
        },
        {
          id: "api",
          label: "API Layer",
          type: "api",
          details: {
            framework: "ASP.NET Core 8 / C# / SignalR",
            auth: "JWT Bearer Authentication with BCrypt",
            dataAccess: "Entity Framework Core 8",
            validation: "API/model validation + business-rule validation",
            testing: "xUnit + Moq + WebApplicationFactory",
          },
        },
        {
          id: "db",
          label: "SQL Server",
          type: "database",
          details: {
            dataAccess: "Entity Framework Core 8",
            notes: "13 tables, 11 stored procedures, 4 views, 3 table-valued functions, 9 performance indexes. Temporal tables for audit compliance.",
          },
        },
        {
          id: "cache",
          label: "Redis",
          type: "cache",
          details: {
            notes: "Redis caching for KPI data with employee-scoped keys and configurable TTLs (30s–600s).",
          },
        },
      ],
      connections: [
        { from: "fe", to: "api" },
        { from: "api", to: "db" },
        { from: "api", to: "cache" },
      ],
    },
  },
  {
    id: "sys-002",
    name: "Employee Portal (RCMS)",
    function: "Centralizes employee information, calendars, training-related information, and employee-facing HR functionality.",
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Axios", "Zod", "React Router 6", "ASP.NET Core 8", "C#", "Entity Framework Core", "FluentValidation", "MailKit", "Redis", "Polly", "Serilog", "SQL Server"],
    status: "production",
    summary:
      "A centralized employee portal designed to bring HR-related employee information and functionality into one application. Replaces a manual process where 500+ employees had to contact HR or navigate multiple legacy systems just to view their own data.",
    narrative:
      "I built a self-service HR portal for a Toyota-group manufacturing company, replacing a manual process where 500+ employees had to contact HR or navigate multiple legacy systems just to view their own data. The system gives every employee a single dashboard showing their profile, government IDs, employment history, timekeeping, leave, overtime, and training records — all read from the company's existing SQL Server HR database through Entity Framework views and table-valued functions.",
    sellingPoints: [
      "13 RESTful API controllers with ~60+ endpoints across auth, profile, timekeeping, leave, overtime, training, dashboard, FAQ, feedback, admin, and SSO",
      "Cross-application SSO token generation for seamless access to Transportation Reimbursement app",
      "JWT auth with HttpOnly cookies + CSRF + refresh token rotation + progressive lockout (3 attempts → 2→6→12 min)",
      "Dual-database architecture — RCMSDBLive (read-only HR views/TVFs) + EPDBLive (writable SSO tables)",
      "Redis distributed caching with employee-scoped cache keys and configurable TTLs (30s–600s)",
      "Documented CI/CD pipeline with GitHub Actions, self-hosted runner, zero-downtime deployment",
      "PBKDF2 password hashing with 100K iterations, 256-bit salt and hash",
      "Security headers: HSTS, X-Frame-Options DENY, X-XSS-Protection, Referrer-Policy",
    ],
    architecture: {
      nodes: [
        {
          id: "fe",
          label: "Web Client",
          type: "frontend",
          details: {
            framework: "React 18 / TypeScript / Vite / Tailwind CSS",
            auth: "JWT in HttpOnly cookies + CSRF tokens",
            testing: "Vitest + React Testing Library",
          },
        },
        {
          id: "api",
          label: "API Layer",
          type: "api",
          details: {
            framework: "ASP.NET Core 8 / C# / FluentValidation",
            auth: "JWT Bearer Authentication / SSO",
            dataAccess: "Entity Framework Core",
            validation: "FluentValidation + Zod (frontend)",
          },
        },
        {
          id: "db",
          label: "SQL Server",
          type: "database",
          details: {
            dataAccess: "Entity Framework Core",
            notes: "Dual-database: RCMSDBLive (read-only HR views/TVFs) + EPDBLive (writable SSO tables)",
          },
        },
        {
          id: "cache",
          label: "Redis",
          type: "cache",
          details: {
            notes: "Distributed caching with employee-scoped keys and configurable TTLs",
          },
        },
      ],
      connections: [
        { from: "fe", to: "api" },
        { from: "api", to: "db" },
        { from: "api", to: "cache" },
      ],
    },
  },
  {
    id: "sys-003",
    name: "Transpo Reimbursement System",
    function: "End-to-end expense reimbursement platform for transportation and OT-extension claims with map-verified routes.",
    stack: ["Next.js", "React 19", "TypeScript", "TanStack Query", "Chart.js", "Leaflet", ".NET 8", "ASP.NET Core", "EF Core", "Redis", "SQL Server", "xUnit", "Vitest"],
    status: "production",
    summary:
      "A complete enterprise LOB web application for managing transportation and OT-extension expense claims with map-verified routes, multi-level approval workflows, and real-time analytics dashboards.",
    narrative:
      "I built an end-to-end expense reimbursement platform for a Toyota-group company. Employees submit transportation and OT-extension claims with map-verified routes; approvers move them through a Supervisor→Manager→DGM signing chain; admins get a real-time analytics dashboard.",
    sellingPoints: [
      "Auth with SSO + lockout + audit, role-based multi-level approval state machine",
      "PDF generation, dashboards, real routing API, external workflow automation",
      "Corporate SSO introspection, HR DB read, DBA-fixed SQL contract",
      "IIS/TLS internal deployment, Power Automate approval-notification flow",
      "Refresh-token rotation, CSRF tokens, BCrypt, rate limiting, security headers",
      "Full test coverage on both frontend and backend tiers",
    ],
    architecture: {
      nodes: [
        {
          id: "fe",
          label: "Web Client",
          type: "frontend",
          details: {
            framework: "Next.js / React 19 / TypeScript / TanStack Query",
            auth: "JWT + SSO (OAuth2 introspection)",
            testing: "Vitest + React Testing Library",
          },
        },
        {
          id: "api",
          label: "API Layer",
          type: "api",
          details: {
            framework: "ASP.NET Core Minimal APIs / .NET 8",
            auth: "JWT Bearer + SSO introspection",
            dataAccess: "Entity Framework Core",
            testing: "xUnit + Moq + WebApplicationFactory",
          },
        },
        {
          id: "db",
          label: "SQL Server",
          type: "database",
          details: {
            dataAccess: "Entity Framework Core + stored procedures",
            notes: "DBA-fixed SQL contract for HR database integration",
          },
        },
        {
          id: "cache",
          label: "Redis",
          type: "cache",
          details: {
            notes: "Redis caching for rate limiting and session management",
          },
        },
      ],
      connections: [
        { from: "fe", to: "api" },
        { from: "api", to: "db" },
        { from: "api", to: "cache" },
      ],
    },
  },
  {
    id: "sys-004",
    name: "Cipher (VulnChecker)",
    function: "Multi-ecosystem dependency vulnerability scanner with CLI, REST API, web UI, and VS Code extension.",
    stack: ["Python", "FastAPI", "React 19", "TypeScript", "Vite", "Tailwind CSS", "VS Code Extension API", "GitHub Actions"],
    status: "development",
    summary:
      "A security tool that checks packages across 7 programming languages against OSV and NIST NVD databases, delivering results through four interfaces: REST API, CLI, web dashboard, and VS Code extension.",
    narrative:
      "I built a multi-ecosystem dependency vulnerability scanner that checks packages across 7 programming languages (npm, PyPI, Go, Maven, NuGet, RubyGems, Cargo) against the OSV and NIST NVD databases. The backend is Python/FastAPI with an async concurrent scanning engine — semaphore-limited to 20 parallel API requests with retry logic and exponential backoff.",
    sellingPoints: [
      "Four delivery mechanisms from one codebase: REST API, CLI, web UI, VS Code extension",
      "Concurrent scanning engine using asyncio.Semaphore for rate-limited parallel HTTP requests",
      "7-ecosystem parser system handling 13+ manifest and lock file formats",
      "Dual-source vulnerability intelligence: merges CVE data from OSV and NIST NVD databases",
      "VS Code extension with inline security feedback and debounced re-scanning",
      "CI/CD integration with GitHub Code Scanning via reusable GitHub Actions workflow",
      "Fix engine with risk classification (safe/minor/major upgrades)",
      "Industry-standard compliance output: SPDX 2.3, CycloneDX 1.5, SARIF 2.1.0",
      "Package health scoring: 0-100 score per package based on vulnerability severity",
    ],
    architecture: {
      nodes: [
        {
          id: "cli",
          label: "CLI Tool",
          type: "frontend",
          details: {
            framework: "Python / Click / Rich",
            notes: "8 output formats, configurable fail-on-severity gating",
          },
        },
        {
          id: "web",
          label: "Web Dashboard",
          type: "frontend",
          details: {
            framework: "React 19 / TypeScript / Vite / Tailwind CSS",
            notes: "Canvas-based visualizations for vulnerability data",
          },
        },
        {
          id: "vscode",
          label: "VS Code Extension",
          type: "frontend",
          details: {
            framework: "VS Code Extension API / TypeScript",
            notes: "Inline diagnostics, debounced re-scanning, status bar indicator",
          },
        },
        {
          id: "api",
          label: "API Layer",
          type: "api",
          details: {
            framework: "Python / FastAPI",
            notes: "Async concurrent scanning engine, retry with backoff",
          },
        },
        {
          id: "db",
          label: "External APIs",
          type: "external",
          details: {
            notes: "OSV, NIST NVD, npm registry, PyPI registry, GitHub Advisories",
          },
        },
      ],
      connections: [
        { from: "cli", to: "api" },
        { from: "web", to: "api" },
        { from: "vscode", to: "api" },
        { from: "api", to: "db" },
      ],
    },
  },
  {
    id: "sys-005",
    name: "Microsoft Dynamics 365 ↔ BIR EIS Integration",
    function: "Integrates business transaction/invoice functionality with the BIR Electronic Invoicing System environment.",
    stack: ["Microsoft Dynamics 365", ".NET", "BIR EIS"],
    status: "production",
    summary:
      "Worked on integration and configuration activities connecting Microsoft Dynamics 365 with the BIR Electronic Invoicing System. Work included certificate acquisition, application-key configuration, sandbox application setup, testing support, and invoice-related fixes.",
    narrative:
      "Supported external company integration of electronic invoicing system (BIR EIS). Handled certificate acquisition, application-key configuration, sandbox application setup, testing support, and invoice-related fixes that prevented regulatory penalties.",
    sellingPoints: [
      "Real-world enterprise integration with government regulatory system",
      "Certificate acquisition and application-key configuration",
      "Sandbox application setup and testing support",
      "Invoice-related fixes preventing regulatory penalties",
    ],
    architecture: {
      nodes: [
        {
          id: "ext",
          label: "Microsoft Dynamics 365",
          type: "external",
          details: {
            notes: "Source system for business transactions and invoices.",
          },
        },
        {
          id: "api",
          label: "Integration / API Layer",
          type: "api",
          details: {
            validation: "External-system validation + invoice/business-rule validation",
          },
        },
        {
          id: "eis",
          label: "BIR Electronic Invoicing System",
          type: "external",
          details: {
            notes: "BIR EIS sandbox application setup, application key configuration, certificate acquisition, invoice-related fixes, integration testing.",
          },
        },
      ],
      connections: [
        { from: "ext", to: "api" },
        { from: "api", to: "eis" },
      ],
    },
  },
];

export const featuredSystemIds = ["sys-001", "sys-002", "sys-003", "sys-004", "sys-005"];

// --- ENGINEERING LOG ---

export const engineeringLog: EngineeringLogEntry[] = [
  {
    id: "eng-001",
    title: "Diagnosing User-Specific OTP Verification Failure",
    date: "2026-08",
    problem:
      "A user was unable to complete OTP verification during registration even though the credentials and OTP appeared to be correct. Other users were able to complete the same registration flow successfully.",
    investigation:
      "Compared the failing user's behavior against successful registration attempts and examined the registration/session flow. Because the failure was isolated to a specific user rather than affecting the overall OTP mechanism, the investigation focused on state persistence and stale registration data rather than assuming the OTP service itself was broken.",
    rootCause:
      "Suspected stale session or cached registration state. Exact root cause was not conclusively documented.",
    solution:
      "Cleared/reset the affected registration state and corrected the registration flow so the user could retry verification with a clean state.",
    result:
      "The registration issue was resolved and the user was asked to retry the verification process.",
    lesson:
      "User-specific authentication failures should be investigated separately from system-wide authentication failures. A successful OTP service does not guarantee that the client/session state surrounding it is valid.",
    relatedSystemId: "sys-002",
  },
  {
    id: "eng-002",
    title: "Diagnosing ASP.NET Core IIS Deployment Failure",
    date: "2026-08",
    problem:
      "An ASP.NET Core application failed to start when hosted through IIS and returned HTTP Error 500.31.",
    investigation:
      "Investigated the IIS hosting environment, .NET installation/runtime availability, and the application's required ASP.NET Core runtime version.",
    rootCause:
      "Runtime/environment mismatch involving the required Microsoft.AspNetCore.App 8.0.x runtime.",
    solution:
      "Verified the installed .NET/ASP.NET Core runtime and aligned the deployment environment with the application's required .NET 8 runtime.",
    result:
      "Identified the deployment environment as the source of the startup failure rather than treating the application code itself as the primary problem.",
    lesson:
      "Deployment failures should be investigated from the environment inward. Runtime availability, hosting configuration, and application requirements need to be verified before rewriting application code.",
    relatedSystemId: "sys-001",
  },
];

// --- DECISION LOG ---

export const decisionLog: DecisionLogEntry[] = [
  {
    id: "dec-001",
    title: "Use a Layered Full-Stack Architecture",
    decision: "Separate the application into frontend, API/backend, database, and supporting infrastructure layers.",
    why: "Provides clearer separation of responsibilities and makes business applications easier to maintain, test, debug, and deploy.",
    alternative: "A tightly coupled application structure.",
    tradeoff:
      "More architectural structure and code boundaries in exchange for maintainability and easier testing.",
    relatedSystemId: "sys-001",
  },
  {
    id: "dec-002",
    title: "Use EF Core for Database Access",
    decision: "Use Entity Framework Core as the primary database access layer for .NET applications.",
    why: "Provides a consistent ORM-based approach to working with SQL Server while integrating naturally with the .NET application layer.",
    alternative: "Direct SQL/ADO.NET database access.",
    tradeoff:
      "ORM abstraction and developer productivity versus less direct control over SQL execution.",
    relatedSystemId: "sys-001",
  },
  {
    id: "dec-003",
    title: "Use JWT-Based Authentication",
    decision: "Use JWT Bearer authentication for API authorization.",
    why: "Provides a standard token-based authentication mechanism for frontend-to-API communication.",
    alternative: "Session-based authentication.",
    tradeoff:
      "Stateless API authorization and frontend flexibility versus the additional complexity of token lifecycle/security management.",
    relatedSystemId: "sys-001",
  },
  {
    id: "dec-004",
    title: "Introduce Redis for Supporting Infrastructure",
    decision: "Use Redis where caching/rate-limiting infrastructure provides value.",
    why: "Reduce unnecessary repeated work and support application-level rate limiting/caching requirements.",
    alternative: "Rely entirely on application memory or database-backed mechanisms.",
    tradeoff:
      "Adds infrastructure complexity and another dependency in exchange for better scalability and centralized cache/rate-limit state.",
    relatedSystemId: "sys-001",
  },
];

// --- EXPERIENCE ---

export const experience: ExperienceEntry[] = [
  {
    id: "exp-001",
    role: "Fullstack Developer",
    company: "Toyota Aisin Philippines, Inc.",
    period: "Oct 2025 — Present",
    outcomes: [
      "Built and deployed 3 production enterprise applications used by 800+ employees, owning requirements analysis, system design, full-stack development, deployment, and production support.",
      "Developed an employee self-service portal with 60+ RESTful API endpoints, integrating enterprise HR data and cross-application SSO.",
      "Built a transportation reimbursement platform with map-verified routes, Supervisor → Manager → DGM approval workflows, PDF generation, and analytics dashboards.",
      "Built an environmental compliance monitoring system that evaluates wastewater measurements against regulatory standards, automatically classifies results as Pass/Fail/Critical, maintains audit history, and triggers notifications for critical values.",
      "Took ownership of the company's BIR EIS integration, resolving a critical production issue and providing ongoing technical support. Worked directly with the external development team on Microsoft Dynamics 365 integration, troubleshooting issues, providing technical guidance, and developing sandbox applications for integration testing.",
      "Implemented JWT authentication, role-based access control, audit logging, and automated unit/integration testing across production applications.",
      "Established CI/CD pipelines using GitHub Actions and deployed production applications through IIS.",
    ],
    systemIds: ["sys-001", "sys-002", "sys-003", "sys-005"],
  },
  {
    id: "exp-002",
    role: "Freelance Fullstack Developer",
    company: "Self-employed",
    period: "May 2025 — Sept 2025",
    outcomes: [
      "Delivered end-to-end full-stack applications for clients, translating business requirements into technical specifications, system architecture, and production-ready solutions.",
      "Designed database schemas and application architecture based on client workflows, data requirements, and expected usage.",
      "Developed responsive web applications using React, Next.js, and TypeScript, implementing frontend interfaces, application logic, API integrations, and data-driven features.",
      "Managed the complete development lifecycle, including requirements gathering, development, testing, deployment, and post-launch maintenance.",
      "Deployed and maintained production applications on Vercel, supporting real end users and addressing issues throughout the application's lifecycle.",
    ],
    systemIds: [],
  },
  {
    id: "exp-003",
    role: "System Development Intern",
    company: "Health Office Malvar",
    period: "Feb 2025 — May 2025",
    outcomes: [
      "Digitized manual, paper-based health office workflows, replacing paper records and manual data entry with internal software systems.",
      "Developed an inventory management system using HTML, CSS, JavaScript, and PHP, with automated inventory counting and centralized stock tracking.",
      "Replaced manual inventory calculations with automated quantity tracking, improving consistency and reducing repetitive data entry.",
      "Packaged and deployed the system as a desktop application using Electron, enabling health office personnel to use the system directly on their work computers.",
      "Deployed the application for actual day-to-day operational use, refining features and resolving issues based on user feedback and workflow requirements.",
    ],
    systemIds: [],
  },
];

// --- STACK ---

export const stack: StackItem[] = [
  // ═══════════════════════════════════════════════════════════
  // CORE TOOLS — Tier 1 (Daily professional use)
  // ═══════════════════════════════════════════════════════════
  // Frontend
  { name: "Next.js", category: "core", tier: 1, projectIds: ["sys-003"] },
  { name: "React", category: "core", tier: 1, projectIds: ["sys-001", "sys-002", "sys-003"] },
  { name: "TypeScript", category: "core", tier: 1, projectIds: ["sys-001", "sys-002", "sys-003"] },

  // Backend
  { name: "C#", category: "core", tier: 1, projectIds: ["sys-001", "sys-002", "sys-003"] },
  { name: ".NET 8", category: "core", tier: 1, projectIds: ["sys-001", "sys-002"] },
  { name: "ASP.NET Core", category: "core", tier: 1, projectIds: ["sys-001", "sys-002"] },
  { name: "EF Core", category: "core", tier: 1, projectIds: ["sys-001", "sys-002"] },

  // Data
  { name: "SQL Server", category: "data", tier: 1, projectIds: ["sys-001", "sys-002"] },

  // ═══════════════════════════════════════════════════════════
  // SUPPORTING — Tier 2 (Used in projects)
  // ═══════════════════════════════════════════════════════════
  // Frontend supporting
  { name: "Tailwind CSS", category: "supporting", tier: 2, projectIds: ["sys-001", "sys-002", "sys-003"] },
  { name: "TanStack Query", category: "supporting", tier: 2, projectIds: ["sys-003"] },
  { name: "Leaflet", category: "supporting", tier: 2, projectIds: ["sys-003"] },

  // Backend supporting
  { name: "Minimal APIs", category: "supporting", tier: 2, projectIds: ["sys-001"] },
  { name: "JWT", category: "supporting", tier: 2, projectIds: ["sys-001", "sys-002"] },

  // Data supporting
  { name: "Redis", category: "data", tier: 2, projectIds: ["sys-001", "sys-002", "sys-003"] },
  { name: "MongoDB", category: "data", tier: 2, projectIds: [] },

  // Infra supporting
  { name: "IIS", category: "infra", tier: 2, projectIds: ["sys-001", "sys-002"] },
  { name: "Docker", category: "infra", tier: 2, projectIds: [] },

  // Testing supporting
  { name: "Vitest", category: "testing", tier: 2, projectIds: ["sys-001", "sys-002"] },
  { name: "RTL", category: "testing", tier: 2, projectIds: ["sys-001", "sys-002"] },
  { name: "xUnit", category: "testing", tier: 2, projectIds: ["sys-001"] },
  { name: "Moq", category: "testing", tier: 2, projectIds: ["sys-001"] },

  // ═══════════════════════════════════════════════════════════
  // INFRASTRUCTURE — Tier 3 (Deployment & hosting)
  // ═══════════════════════════════════════════════════════════
  { name: "AWS", category: "infra", tier: 3, projectIds: [] },
  { name: "Azure", category: "infra", tier: 3, projectIds: [] },
  { name: "Vercel", category: "infra", tier: 3, projectIds: [] },
  { name: "Kubernetes", category: "infra", tier: 3, projectIds: [] },
  { name: "CI/CD", category: "infra", tier: 3, projectIds: [] },

  // ═══════════════════════════════════════════════════════════
  // INTEGRATIONS — Tier 2 (Enterprise/business systems)
  // ═══════════════════════════════════════════════════════════
  { name: "Dynamics 365", category: "integrations", tier: 2, projectIds: ["sys-005"] },
  { name: "BIR EIS", category: "integrations", tier: 2, projectIds: ["sys-005"] },
  { name: "Firebase", category: "integrations", tier: 3, projectIds: [] },

  // ═══════════════════════════════════════════════════════════
  // AI EXPLORATION — Tier 4 (Learning & experimenting)
  // ═══════════════════════════════════════════════════════════
  { name: "Python", category: "ai-exploration", tier: 4, projectIds: [] },
  { name: "FastAPI", category: "ai-exploration", tier: 4, projectIds: [] },
  { name: "PyTorch", category: "ai-exploration", tier: 4, projectIds: [] },
  { name: "RAG", category: "ai-exploration", tier: 4, projectIds: [] },
  { name: "Vector DB", category: "ai-exploration", tier: 4, projectIds: [] },
  { name: "LangChain", category: "ai-exploration", tier: 4, projectIds: [] },
  { name: "Ollama", category: "ai-exploration", tier: 4, projectIds: [] },
  { name: "Angular", category: "supporting", tier: 3, projectIds: [] },
  { name: "GitHub Actions", category: "infra", tier: 2, projectIds: ["sys-001", "sys-002", "sys-003"] },
];

// --- CREDENTIALS ---

export const credentials: Credential[] = [
  {
    id: "cred-003",
    type: "link",
    title: "GitHub",
    url: "https://github.com/joshivan",
  },
  {
    id: "cred-004",
    type: "link",
    title: "LinkedIn",
    url: "https://linkedin.com/in/joshivan",
  },
];

// --- CV ---

export const cvSections: CVSection[] = [
  {
    id: "summary",
    title: "Professional Summary",
    items: [
      {
        label: "",
        detail:
          "Software Engineer experienced in building, deploying, and supporting production enterprise applications. Built 3 production systems used by 800+ employees, contributing across system design, full-stack development, REST API development, database design, security, testing, deployment, and production support. Experienced with C#, ASP.NET Core, React, Next.js, TypeScript, SQL Server, Redis, Python, and FastAPI, with additional experience in enterprise integrations, AI application development, and developer security tooling.",
      },
    ],
  },
  {
    id: "experience",
    title: "Experience",
    items: [
      {
        label: "Fullstack Developer — Toyota Aisin Philippines, Inc.",
        period: "Oct 2025 — Present",
        detail: "Built and deployed 3 production enterprise applications used by 800+ employees across requirements analysis, system design, development, testing, deployment, and production support. Developed an Employee Self-Service Portal with 60+ RESTful API endpoints, integrating enterprise HR data, JWT authentication, Redis caching, and cross-application SSO. Built a Transportation Reimbursement System with map-verified routes, multi-level approval workflows, PDF/Excel generation, dashboards, and real-time notifications. Developed an Environmental Compliance Monitoring System that evaluates wastewater measurements against regulatory standards and automatically classifies results as Pass/Fail/Critical, with audit history and critical-value notifications. Resolved a critical BIR EIS integration issue with Microsoft Dynamics 365, becoming the primary internal support contact. Implemented application security using JWT, HttpOnly cookies, role-based authorization, CSRF protection, refresh-token rotation, password hashing, and rate limiting. Established CI/CD pipelines using GitHub Actions and deployed through IIS.",
      },
      {
        label: "Freelance Fullstack Developer — Self-Employed",
        period: "May 2025 — Sept 2025",
        detail: "Delivered end-to-end web applications by translating client requirements into technical specifications, system designs, and production-ready implementations. Built responsive applications using React, Next.js, TypeScript, Tailwind CSS, and REST APIs. Managed development through deployment, maintenance, and post-launch support.",
      },
      {
        label: "System Development Intern — Health Office Malvar",
        period: "Feb 2025 — May 2025",
        detail: "Digitized paper-based workflows by replacing manual records and repetitive data entry with internal software systems. Built an inventory management system using HTML, CSS, JavaScript, and PHP with automated inventory counting and centralized stock tracking. Packaged and deployed the system as a desktop application using Electron for operational use.",
      },
    ],
  },
  {
    id: "projects",
    title: "Personal Projects",
    items: [
      {
        label: "SmartWay — AI Study Companion",
        detail: "React, TypeScript, Vite, Node.js, Express, Google Gemini API, Supabase. AI-powered study companion that transforms PDF, Word, and text documents into summaries, flashcards, and quizzes. Handles files up to 50 MB and text inputs up to 200,000 characters with validation, cloud storage, and production deployment.",
      },
      {
        label: "TruthCheck AI — AI Scam & Misinformation Analyzer",
        detail: "React, TypeScript, Node.js, Express, Google Gemini API. AI-powered platform that analyzes messages, suspicious links, and news articles for phishing, scams, and misinformation. Implements rate limiting, input validation, CORS, Helmet security headers, and privacy-first no-login architecture.",
      },
      {
        label: "Cipher — Developer Security & Vulnerability Analysis Tool",
        detail: "Python, FastAPI, React, TypeScript, SQLite, VS Code Extension API. Developer security tool for dependency vulnerability analysis and CVE enrichment, integrating OSV, NIST NVD, GitHub Advisory, npm, and PyPI APIs. Includes FastAPI REST API, React interface, and VS Code extension with inline diagnostics and SARIF integration.",
      },
    ],
  },
  {
    id: "skills",
    title: "Technical Skills",
    items: [
      {
        label: "Languages",
        detail: "C#, TypeScript, JavaScript, Python, SQL, PHP, HTML, CSS",
      },
      {
        label: "Frontend",
        detail: "React, Next.js, Vite, Tailwind CSS, Redux Toolkit, TanStack Query, Chart.js, Recharts, Leaflet",
      },
      {
        label: "Backend",
        detail: "ASP.NET Core, .NET 8, FastAPI, Node.js, Express, Entity Framework Core, RESTful APIs, SignalR",
      },
      {
        label: "Databases & DevOps",
        detail: "SQL Server, SQLite, Redis | GitHub Actions, IIS, Docker, Vercel",
      },
      {
        label: "Testing & Security",
        detail: "xUnit, Moq, Vitest, RTL | JWT, CSRF, BCrypt, Rate Limiting, Helmet",
      },
      {
        label: "Integrations",
        detail: "Microsoft Dynamics 365, BIR EIS, Google Gemini API, OSV API, NIST NVD API, GitHub API",
      },
    ],
  },
  {
    id: "certifications",
    title: "Certifications",
    items: [
      {
        label: "In progress — curated on request",
        detail: "Professional development tracked in Engineering Log and decision records.",
        period: "2024 — Present",
      },
    ],
  },
  {
    id: "education",
    title: "Education",
    items: [
      {
        label: "B.S. Information Systems — Batangas State University",
        detail: "Focus on software engineering and systems analysis.",
        period: "2021 — 2025",
      },
    ],
  },
];

// --- LIVE SYSTEM LAB ---

export interface ValidationRule {
  field: string;
  min?: number;
  max?: number;
  required?: boolean;
  pattern?: RegExp;
  message: string;
}

export const labValidationRules: ValidationRule[] = [
  { field: "temperature", min: 18, max: 28, required: true, message: "Temperature must be between 18°C and 28°C" },
  { field: "humidity", min: 30, max: 70, required: true, message: "Humidity must be between 30% and 70%" },
  { field: "pressure", min: 980, max: 1040, required: true, message: "Pressure must be between 980 and 1040 hPa" },
  { field: "batchId", required: true, pattern: /^BATCH-[A-Z0-9]{6}$/, message: "Batch ID must match format BATCH-XXXXXX" },
];

export type ValidationStatus = "PASSED" | "WARNING" | "CRITICAL";

export function validateLabParameters(params: Record<string, string>): {
  status: ValidationStatus;
  results: { field: string; status: ValidationStatus; message: string }[];
} {
  const results: { field: string; status: ValidationStatus; message: string }[] = [];
  let overallStatus: ValidationStatus = "PASSED";

  for (const rule of labValidationRules) {
    const value = params[rule.field];
    let fieldStatus: ValidationStatus = "PASSED";
    let message = "OK";

    if (rule.required && (!value || value.trim() === "")) {
      fieldStatus = "CRITICAL";
      message = `${rule.field} is required`;
    } else if (value) {
      if (rule.pattern && !rule.pattern.test(value)) {
        fieldStatus = "CRITICAL";
        message = rule.message;
      } else if (rule.min !== undefined || rule.max !== undefined) {
        const num = parseFloat(value);
        if (isNaN(num)) {
          fieldStatus = "CRITICAL";
          message = `${rule.field} must be a number`;
        } else {
          const min = rule.min ?? -Infinity;
          const max = rule.max ?? Infinity;
          if (num < min || num > max) {
            const margin = (max - min) * 0.1;
            if (num < min - margin || num > max + margin) {
              fieldStatus = "CRITICAL";
            } else {
              fieldStatus = "WARNING";
            }
            message = rule.message;
          }
        }
      }
    }

    results.push({ field: rule.field, status: fieldStatus, message });
    if (fieldStatus === "CRITICAL") overallStatus = "CRITICAL";
    else if (fieldStatus === "WARNING" && overallStatus !== "CRITICAL") overallStatus = "WARNING";
  }

  return { status: overallStatus, results };
}
