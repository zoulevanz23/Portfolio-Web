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

export interface InsideBuildFlowStep {
  label: string;
  detail: string;
}

export interface InsideBuildDecision {
  choice: string;
  why: string;
}

export interface InsideBuild {
  problem: string;
  context?: string;
  flow: InsideBuildFlowStep[];
  decisions: InsideBuildDecision[];
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
  insideBuild?: InsideBuild;
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
  // Anchor dates for auto-computed KPI stats (update these, not the display strings).
  experienceStart: "2025-02-01",
  developmentStart: "2024-09-01",
  thesis:
    "I build full-stack systems that turn real-world business processes into reliable, maintainable software.",
  email: "Available on request",
  github: "https://github.com/joshivan",
  linkedin: "https://linkedin.com/in/joshivan",
};

// Full months between two dates, ignoring day-of-month.
function fullMonthsBetween(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

// "1y 7m+", "2y+", "5mo+" ... month-precision so the display ticks every month.
// Pass `now` for testability; defaults to the current date at call time.
export function yearsSince(startIso: string, now: Date = new Date()): string {
  const months = Math.max(0, fullMonthsBetween(new Date(startIso), now));
  if (months < 12) return `${months}mo+`;
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return remainder === 0 ? `${years}y+` : `${years}y ${remainder}m+`;
}

export const proofStrip = [
  { label: "Systems Shipped", value: "3+" },
  { label: "Full-Stack Scope", value: "Frontend → API → DB" },
  { label: "Production Status", value: "2 in production" },
  { label: "Current Stack", value: ".NET 8 / Next.js / TypeScript / SQL Server" }
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
    name: "Wastewater Parameter Monitoring System",
    function: "Monitors wastewater quality parameters and evaluates laboratory measurements against environmental standards.",
    stack: ["React 18", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Recharts", "TanStack Table", "ASP.NET Core 8", "C#", "Entity Framework Core", "SignalR", "Redis", "QuestPDF", "ClosedXML", "MailKit", "SQL Server"],
    status: "production",
    summary:
      "A full-stack environmental compliance system for recording and monitoring wastewater laboratory measurements across multiple monitoring points. The system evaluates measured parameters against defined standards and surfaces Passed, Failed, and Critical results through dashboards and reporting workflows.",
    narrative:
      "I built an end-to-end environmental compliance monitoring platform for an automotive parts manufacturer. The system tracks wastewater parameters across 9 facility sections — discharge, aeration, clarifiers, equalization — with a server-side judgment engine that automatically classifies every reading as Pass, Fail, or Critical against national regulatory and company-internal standards.",
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
    insideBuild: {
      problem:
        "Users previously had to manually compare laboratory values against acceptable standards. Readings were recorded on paper or spreadsheets, then checked by eye against national regulatory limits and stricter company-internal thresholds — slow, error-prone, and with no audit trail when a critical value slipped through.",
      context: "9 facility sections — discharge, aeration, clarifiers, equalization — each with its own parameter set and limits.",
      flow: [
        { label: "Input", detail: "Lab personnel record wastewater measurements per monitoring point and parameter." },
        { label: "Validation", detail: "API rejects malformed readings early — range, format, and required-field checks before any business logic runs." },
        { label: "Standard Evaluation", detail: "Server-side judgment engine compares each reading against regulatory and company-internal standards." },
        { label: "Classification", detail: "Every reading is classified as Pass, Fail, or Critical, with temporal-table history for audit compliance." },
        { label: "Dashboard", detail: "SignalR pushes live results to dashboards; Redis caches KPI aggregates with employee-scoped keys." },
        { label: "Report + Notify", detail: "Async PDF/Excel export via QuestPDF and ClosedXML; transactional outbox + MailKit fires reliable critical-value email notifications." },
      ],
      decisions: [
        { choice: ".NET 8 / ASP.NET Core / EF Core", why: "Strong ecosystem for enterprise applications and integration with existing Microsoft infrastructure. EF Core maps cleanly to the 13-table schema while stored procedures and views handle reporting-heavy reads." },
        { choice: "SQL Server with temporal tables", why: "Relational structure fits the application's reporting and transactional requirements. Temporal tables give an automatic audit trail for compliance without hand-rolled history tables." },
        { choice: "React + SignalR + Redis", why: "Component-driven UI with strong support for data-heavy applications. SignalR delivers live monitoring updates and Redis-backed KPI caching keeps dashboard queries off the transactional database." },
      ],
    },
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
    name: "Employee Portal",
    function: "Centralizes employee information, calendars, training-related information, and employee-facing HR functionality.",
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "Axios", "Zod", "React Router 6", "ASP.NET Core 8", "C#", "Entity Framework Core", "FluentValidation", "MailKit", "Redis", "Polly", "Serilog", "SQL Server"],
    status: "production",
    summary:
      "A centralized employee portal designed to bring HR-related employee information and functionality into one application. Replaces a manual process where 500+ employees had to contact HR or navigate multiple legacy systems just to view their own data.",
    narrative:
      "I built a self-service HR portal for a manufacturing company, replacing a manual process where 500+ employees had to contact HR or navigate multiple legacy systems just to view their own data. The system gives every employee a single dashboard showing their profile, government IDs, employment history, timekeeping, leave, overtime, and training records — all read from the company's existing SQL Server HR database through Entity Framework views and table-valued functions.",
    sellingPoints: [
      "13 RESTful API controllers with ~60+ endpoints across auth, profile, timekeeping, leave, overtime, training, dashboard, FAQ, feedback, admin, and SSO",
      "Cross-application SSO token generation for seamless access to Transportation Reimbursement app",
      "JWT auth with HttpOnly cookies + CSRF + refresh token rotation + progressive lockout (3 attempts → 2→6→12 min)",
      "Dual-database architecture — HR database (read-only views/TVFs) + portal database (writable SSO tables)",
      "Redis distributed caching with employee-scoped cache keys and configurable TTLs (30s–600s)",
      "Documented CI/CD pipeline with GitHub Actions, self-hosted runner, zero-downtime deployment",
      "PBKDF2 password hashing with 100K iterations, 256-bit salt and hash",
      "Security headers: HSTS, X-Frame-Options DENY, X-XSS-Protection, Referrer-Policy",
    ],
    insideBuild: {
      problem:
        "Over 500 employees had to contact HR or navigate multiple legacy systems just to view their own data — profile, government IDs, employment history, timekeeping, leave, overtime, and training records. Every lookup cost HR staff time and left employees without a single source of truth.",
      context: "Company HR data already existed in SQL Server but was only reachable through legacy screens and manual requests.",
      flow: [
        { label: "HR Source", detail: "Existing HR database exposed read-only through Entity Framework views and table-valued functions — no migration of legacy data." },
        { label: "API Aggregation", detail: "13 controllers with ~60+ endpoints aggregate profile, timekeeping, leave, overtime, and training into per-employee responses." },
        { label: "Cache", detail: "Redis distributed cache with employee-scoped keys and 30s–600s TTLs keeps repeated dashboard loads off the HR database." },
        { label: "Dashboard", detail: "Single self-service dashboard per employee replaces the contact-HR loop for everyday lookups." },
        { label: "SSO Handoff", detail: "Cross-application SSO token generation carries the session seamlessly into the Transportation Reimbursement app." },
      ],
      decisions: [
        { choice: "Dual-database architecture", why: "The HR database stays read-only against the legacy HR schema while a separate portal database holds writable SSO tables. This isolates new writes from regulated HR data and avoids risky schema changes." },
        { choice: "JWT in HttpOnly cookies + CSRF + refresh rotation", why: "Cookie storage keeps tokens out of JavaScript reach while rotation and progressive lockout (3 attempts → 2→6→12 min) contain brute-force and theft scenarios for 500+ accounts." },
        { choice: "React + Vite with FluentValidation and Zod", why: "Component-driven UI with strong support for data-heavy applications. Server-side FluentValidation enforces business rules while Zod mirrors them on the client for instant feedback." },
      ],
    },
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
            notes: "Dual-database: HR database (read-only views/TVFs) + portal database (writable SSO tables)",
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
      "I built an end-to-end expense reimbursement platform for a manufacturing company. Employees submit transportation and OT-extension claims with map-verified routes; approvers move them through a Supervisor→Manager→DGM signing chain; admins get a real-time analytics dashboard.",
    sellingPoints: [
      "Auth with SSO + lockout + audit, role-based multi-level approval state machine",
      "PDF generation, dashboards, real routing API, external workflow automation",
      "Corporate SSO introspection, HR DB read, DBA-fixed SQL contract",
      "IIS/TLS internal deployment, Power Automate approval-notification flow",
      "Refresh-token rotation, CSRF tokens, BCrypt, rate limiting, security headers",
      "Full test coverage on both frontend and backend tiers",
    ],
    insideBuild: {
      problem:
        "Transportation and OT-extension claims were filed manually with unverified routes and a paper Supervisor → Manager → DGM signing chain. Finance had no reliable distance basis for payouts and approvers had no shared view of claim state.",
      context: "Claims, approvals, payouts, and analytics all lived in separate manual steps with no map verification.",
      flow: [
        { label: "Claim Input", detail: "Employees submit transportation and OT-extension claims with route endpoints and supporting details." },
        { label: "Map Route Verify", detail: "Leaflet plus a real routing API verifies claimed distances before a claim can advance." },
        { label: "State Machine", detail: "Role-based multi-level approval state machine enforces the Supervisor → Manager → DGM signing order." },
        { label: "Approval Chain", detail: "Approvers act in sequence with audit logging; SSO introspection carries identity from the Employee Portal." },
        { label: "PDF + Notify", detail: "PDF generation for records plus a Power Automate flow sends approval notifications." },
        { label: "Analytics", detail: "Real-time dashboards aggregate claim volume, amounts, and cycle time for admins." },
      ],
      decisions: [
        { choice: "Next.js with TanStack Query", why: "Component-driven UI with strong support for data-heavy applications. TanStack Query keeps approval queues, claim detail, and analytics dashboards in sync without hand-rolled fetching logic." },
        { choice: "ASP.NET Core Minimal APIs with DBA-fixed SQL contract", why: "Minimal APIs keep the claim and approval surface lean while EF Core plus stored procedures respect the DBA-owned HR database contract." },
        { choice: "Redis with refresh rotation and rate limiting", why: "Centralized session and rate-limit state protects login and claim-submission endpoints while refresh-token rotation and CSRF keep the multi-role approval flow secure." },
      ],
    },
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
    name: "Internal Invoice Compliance System",
    function: "Processes and transmits company invoices to an external electronic invoicing platform through an API integration.",
    stack: [".NET", "C#", "Entity Framework Core", "SQL Server", "External E-Invoicing API", "Sandbox Environment", "Integration Credentials"],
    status: "production",
    summary:
      "An internal enterprise application responsible for processing and transmitting company invoices to an external electronic invoicing platform. Inherited as a legacy production system with extended transmission issues; anonymized to omit credentials, customer info, infra details, endpoints, and confidential business information.",
    narrative:
      "Inherited as a legacy production system that had experienced invoice transmission issues over an extended period. Not the original author, so initial priority was understanding architecture, data flow, business rules, and external API requirements before modifying code. Scope spanned legacy investigation, database and data-flow analysis, API documentation review, credential management, input validation, unit and system testing, end-user validation, deployment, and incident documentation. Acted as technical bridge between internal team, external developers, and external platform support.",
    sellingPoints: [
      "Anonymized enterprise integration — no credentials, customer info, infra details, endpoints, or confidential business data exposed",
      "Legacy discovery before modification: codebase, data flow, and API requirements investigation",
      "Integration credential replacement and configuration after authentication failure (Application → Authentication → API Communication → Validation → Submission)",
      "Separated cancelled-invoice handling from normal submission to fix Index out of bounds",
      "Upstream identifier validation and normalization at system boundary (Identifier + Branch Information)",
      "Sandbox setup, certificate-related support, and application credential management",
      "Multi-level testing: unit, system, integration, and end-user validation with approval process",
      "Production deployment through established hosting with documented incident and decision records",
    ],
    insideBuild: {
      problem:
        "Legacy invoice compliance system failed to transmit invoices to external platform after years in production; failures spanned authentication, data, and integration boundaries.",
      context: "Enterprise Invoice Processing / External API Integration — anonymized. 2026–Present. Role: Developer / System Support / Integration PIC. Portfolio Note: system and organization anonymized; credentials, customer info, infra, endpoints, and confidential business info intentionally omitted.",
      flow: [
        { label: "Source Data", detail: "Invoice and customer data retrieved from upstream source; treated as untrusted input." },
        { label: "Boundary Validation", detail: "Validate customer identifier format; normalize Identifier + Branch Information before downstream processing." },
        { label: "Authentication", detail: "Authenticate to external platform using integration credentials; separated from invoice logic for clear troubleshooting." },
        { label: "Processing", detail: "Separate cancelled invoices from normal submission path to avoid collection/index assumptions." },
        { label: "Submission", detail: "Transmit invoice via external API; handle Index out of bounds and format validation failures." },
        { label: "Testing & Deployment", detail: "Unit, system, end-user validation, then commit and deploy through established hosting with review and approval." },
      ],
      decisions: [
        { choice: "Understand before modifying legacy system", why: "Reduces risk of fixing one problem while creating another when inheriting unfamiliar codebase." },
        { choice: "Separate authentication from invoice-processing", why: "Clear troubleshooting path: Application → Authentication → API Communication → Validation → Submission." },
        { choice: "Validate and normalize at integration boundary", why: "Prevents malformed upstream data from propagating into downstream business logic." },
      ],
    },
    architecture: {
      nodes: [
        { id: "source", label: "Upstream Data Source", type: "external", details: { notes: "Source of invoice and customer records; treated as untrusted input." } },
        { id: "app", label: "Internal Invoice Compliance System", type: "api", details: { framework: ".NET / Entity Framework Core", validation: "Boundary validation + identifier normalization", notes: "Anonymized — no infra details. Handles cancelled vs normal flows separately." } },
        { id: "ext", label: "External Electronic Invoicing Platform", type: "external", details: { notes: "External API; sandbox + production; anonymized endpoints and credentials omitted." } },
        { id: "db", label: "SQL Server", type: "database", details: { dataAccess: "Entity Framework Core", notes: "Anonymized data-flow; no business-sensitive schema exposed." } },
      ],
      connections: [
        { from: "source", to: "app" },
        { from: "app", to: "ext" },
        { from: "app", to: "db" },
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
  {
    id: "eng-003",
    title: "Integration Credential Failure — Internal Invoice Compliance System",
    date: "2026-02",
    problem: "Invoice transmission to the external electronic invoicing platform was failing for an extended period.",
    investigation: "Investigated integration configuration and authentication requirements rather than immediately modifying invoice-processing logic. Reviewed external API documentation to understand expected authentication flow and how the application consumed credentials. Verified existing integration credentials were no longer valid.",
    rootCause: "Integration credentials no longer valid, causing failed communication between internal application and external platform.",
    solution: "Verified status of existing credentials, obtained replacement credentials through administrative process, reviewed how application stored and retrieved configuration, updated configuration to use replacement credentials, reviewed API docs, tested communication, and investigated additional submission behavior after restoring authentication.",
    result: "Integration credentials successfully replaced and configured; gained working understanding of external API and invoice-submission process for later failures.",
    lesson: "Separate authentication problems from invoice-processing problems. Establish whether application can authenticate and communicate first before assuming business logic is broken. Flow: Application → Authentication → API Communication → Invoice Validation → Invoice Submission.",
    relatedSystemId: "sys-005",
  },
  {
    id: "eng-004",
    title: "Invoice Processing Failure: Index Out of Bounds",
    date: "2026-02",
    problem: "Invoice processing failed with Index was out of bounds error.",
    investigation: "Consulted system PIC/end user, reproduced issue, examined affected invoice records, traced application logic, reviewed how invoice statuses were handled, and compared expected flow with actual data. Found cancelled invoices were being included in same processing context as normal submission, creating mismatch between data and code assumptions.",
    rootCause: "Cancelled invoices included in same processing context as normal invoices, causing collection/index assumptions to be violated.",
    solution: "Separated cancelled-invoice handling from normal invoice-submission process so incompatible records would not enter same processing path. Implemented changes, reviewed approach before implementation, then validated through unit testing (normal, cancelled, edge cases), system testing (full workflow), and user validation with system PIC.",
    result: "Change committed, deployed through existing hosting environment, incident documented, and resolution approved through organizational review process. Original issue resolved and validated by end user.",
    lesson: "Fix the underlying processing assumption, not merely the error message. Different business states should not automatically share the same processing path.",
    relatedSystemId: "sys-005",
  },
  {
    id: "eng-005",
    title: "Customer Identifier Format Validation",
    date: "2026-04",
    problem: "Invoice processing failed because a customer identifier retrieved from upstream source did not match format expected by application. Expected Identifier but received Identifier + Branch Information, exceeding expected format and causing downstream validation to fail.",
    investigation: "Traced value through data flow: External/Source Data → Customer Retrieval → Application Validation → Invoice Processing. Found structurally different value at boundary between source data and application data model; issue originated at boundary, not from invoice itself.",
    rootCause: "Upstream source appended Branch Information to tax identifier; application validation expected strict Identifier format.",
    solution: "Proposed and, after supervisor approval, implemented explicit validation and normalization: validate incoming value, identify expected identifier component, remove unexpected appended data, ensure conformance to expected format, prevent malformed values from reaching downstream processing. Tested against valid, malformed, and edge cases; verified normalized values flowed through complete workflow; deployed through established process with documentation and review.",
    result: "Malformed upstream values now normalized at boundary; normalized invoices processed successfully and validated by PIC.",
    lesson: "Treat external or upstream data as untrusted input even when source is internal/trusted. Validation at system boundary prevents malformed data from propagating deeper.",
    relatedSystemId: "sys-005",
  },
  {
    id: "eng-006",
    title: "External E-Invoicing Integration Support",
    date: "2026-03",
    problem: "Broader e-invoicing integration required coordinated support between internal team, external development team, and external platform support.",
    investigation: "Reviewed authentication, application registration, credential requirements, sandbox requirements, API request expectations, validation behavior, and integration prerequisites from documentation. Investigated issues from both sides of integration boundary rather than treating external API as black box. Acted as technical bridge: Internal Application Team → External Development Team → External Platform Support. Determined what internal app needed to provide, what external devs needed to implement, and what platform required, and where failures originated.",
    rootCause: "Integration ownership gap across multiple parties requiring centralized technical coordination for credentials, certificates, sandbox, and documentation.",
    solution: "Handled technical inquiries, supported external developers, managed integration requirements, assisted with credential and certificate setup, prepared sandbox environment, reviewed docs, coordinated with platform support, validated credentials and docs, investigated issues, and communicated requirements between stakeholders.",
    result: "Provided sustained integration support enabling external team implementation; strengthened ability to learn unfamiliar external system via docs and cross-team communication.",
    lesson: "Integration ownership requires understanding requirements well enough to bridge internal, external dev, and platform support — not just referencing docs when errors occur.",
    relatedSystemId: "sys-005",
  },
  {
    id: "eng-007",
    title: "Ongoing Incident Response and Maintenance",
    date: "2026-05",
    problem: "System remains ongoing production responsibility requiring structured approach to reproduce, observe, hypothesize, validate, solve, review, implement, test, deploy, and document incidents.",
    investigation: "Developed structured 10-step approach: 1 Reproduce exact behavior, 2 Observe error messages, UI state, DB records, API responses, config, logs, 3 Form hypothesis from evidence, 4 Validate against code, DB, flow, docs, production/test data, 5 Determine appropriate solution (logic, validation, data handling, config, integration, error handling, process separation), 6 Review with supervisor/PIC for important business processes, 7 Implement smallest appropriate change, 8 Test via unit, system, integration, manual, end-user/PIC validation, 9 Deploy via established process, 10 Document problem, root cause, investigation, resolution, testing, deployment, validation, approval.",
    rootCause: "Legacy enterprise system requires disciplined maintenance to minimize risk while ensuring traceability of changes.",
    solution: "Applied Understand → Isolate → Fix → Validate → Deploy discipline; minimize refactoring during incident resolution; document decision not just code: What happened → Why → What was changed → Why that solution → How tested → How deployed.",
    result: "Established traceable record of what changed and why, enabling future maintenance and troubleshooting across application, API integration, authentication, certificates, sandbox, support, and cross-team communication boundaries.",
    lesson: "Enterprise engineering is rarely just writing new code; it is turning ambiguous failures into concrete technical problems, gathering evidence, controlling changes, and proving business problem solved.",
    relatedSystemId: "sys-005",
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
  {
    id: "dec-005",
    title: "Separate Authentication from Invoice Processing",
    decision: "Establish whether application can authenticate and communicate with external e-invoicing platform before investigating business logic failures.",
    why: "Provides clearer troubleshooting path: Application → Authentication → API Communication → Invoice Validation → Invoice Submission. Prevents conflating auth failures with application logic.",
    alternative: "Assume every failed invoice is caused by application logic and modify processing directly.",
    tradeoff: "Requires upfront investigation of credentials and API docs before code changes, in exchange for accurate root-cause isolation.",
    relatedSystemId: "sys-005",
  },
  {
    id: "dec-006",
    title: "Separate Cancelled Invoice Handling from Normal Submission",
    decision: "Split cancelled-invoice handling into a separate processing path so incompatible records do not enter normal submission context.",
    why: "Cancelled invoices have different structure and assumptions; mixing them caused Index out of bounds by violating collection/index assumptions.",
    alternative: "Make minimal change to suppress index error within shared path.",
    tradeoff: "Additional branching and validation logic versus single-path simplicity, but prevents class of data-mismatch errors and aligns with business process separation.",
    relatedSystemId: "sys-005",
  },
  {
    id: "dec-007",
    title: "Validate and Normalize Upstream Identifier at System Boundary",
    decision: "Validate incoming customer tax identifier, identify expected component, strip unexpected Branch Information, and ensure conformance before downstream processing.",
    why: "External/upstream data may be structurally different even from trusted internal sources; malformed values should not propagate.",
    alternative: "Allow malformed Identifier + Branch Information to flow into invoice pipeline and fail downstream.",
    tradeoff: "Extra validation/normalization step at boundary versus downstream failures and harder debugging.",
    relatedSystemId: "sys-005",
  },
  {
    id: "dec-008",
    title: "Own Integration as Technical Bridge with Documentation-Driven Investigation",
    decision: "Act as bridge between Internal Application Team, External Development Team, and External Platform Support, using API documentation as investigation tool rather than black box.",
    why: "Integration required coordination of authentication, registration, credentials, sandbox, and request expectations across multiple parties.",
    alternative: "Treat external API as black box and only reference docs when errors occur.",
    tradeoff: "Time invested in reading and understanding external system upfront versus faster but fragmented troubleshooting and miscommunication.",
    relatedSystemId: "sys-005",
  },
  {
    id: "dec-009",
    title: "Adopt Structured Incident Response: Reproduce → Document",
    decision: "Use 10-step process: Reproduce → Observe → Hypothesize → Validate → Determine solution → Review → Implement → Test (unit/system/integration/end-user) → Deploy → Document (what/why/changed/tested/deployed). Document decision, not just code.",
    why: "Creates traceable engineering record and minimizes risk in legacy systems by making smallest appropriate change after understanding existing behavior.",
    alternative: "Make random changes until symptom disappears and deploy without layered testing or documentation.",
    tradeoff: "More disciplined process and documentation overhead in exchange for controlled changes, confidence that business problem is solved, and future maintainability.",
    relatedSystemId: "sys-005",
  },
];

// --- EXPERIENCE ---

export const experience: ExperienceEntry[] = [
  {
    id: "exp-001",
    role: "Fullstack Developer",
      company: "Toyota Aisin Philippines, Inc ",
    period: "Oct 2025 — Present",
    outcomes: [
      "Built and deployed 3 production enterprise applications serving 1000 employees, owning development across requirements analysis, system design, implementation, testing, deployment, and production support.",
      "Diagnosed and resolved production failures in a legacy enterprise invoice-processing system integrated with an external electronic invoicing API, tracing issues across application code, database state, API behavior, authentication, and external documentation.",
      "Coordinated with external developers and platform support to validate fixes, manage integration credentials and certificates, and deploy validated changes through IIS.",
      "Developed an Employee Self-Service Portal used by 1000 employees, with 60+ REST API endpoints, enterprise HR-data integration, cross-application SSO, JWT authentication, role-based authorization, and Redis caching.",
      "Built a Transportation Reimbursement System used by 200+ employees, implementing map-verified routes, multi-level approval workflows, automated PDF/Excel generation, dashboards, and real-time notifications.",
      "Developed an Environmental Compliance Monitoring System that evaluates wastewater measurements against regulatory and internal standards through centralized business rules, automatically classifying results, maintaining audit history, and triggering critical-value notifications.",
      "Implemented application security using JWT, HttpOnly cookies, RBAC, CSRF protection, refresh-token rotation, password hashing, and rate limiting.",
      "Automated application build, test, and deployment workflows using GitHub Actions, deploying ASP.NET Core applications to IIS.",
    ],
    systemIds: ["sys-001", "sys-002", "sys-003", "sys-005"],
  },
  {
    id: "exp-002",
    role: "Freelance Fullstack Developer",
      company: "Self-employed",
    period: "May 2025 — Sept 2025",
    outcomes: [
      "Translated client requirements into technical specifications, application designs, and production-ready web applications.",
      "Developed and deployed applications using React, Next.js, TypeScript, Tailwind CSS, and REST APIs.",
    ],
    systemIds: [],
  },
  {
    id: "exp-003",
    role: "System Development Intern",
      company: "Municipal Health Office",
    period: "Feb 2025 — May 2025",
    outcomes: [
      "Replaced manual workflows with internal software systems that centralized operational records and reduced repetitive data entry.",
      "Developed and deployed an inventory management system using JavaScript, PHP, and Electron.",
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
    id: "cred-005",
    type: "certification",
    title: "Foundational C# with Microsoft – Developer Certification",
    issuer: "freeCodeCamp & Microsoft",
    url: "https://www.freecodecamp.org/certification/joshivansartin/foundational-c-sharp-with-microsoft",
    year: "2025-11-19",
  },
  {
    id: "cred-006",
    type: "certification",
    title: "Getting Started with Generative AI",
    issuer: "IBM SkillsBuild",
    url: "https://www.credly.com/go/f8sja5U5",
    year: "2026-09-01",
  },
  {
    id: "cred-007",
    type: "certification",
    title: "Basic PowerApps for Business",
    issuer: "AISIN Asia Pacific Co., Ltd. — DX Promotion",
    year: "2026-04-28",
  },
  {
    id: "cred-008",
    type: "certification",
    title: "Basic PowerBI Desktop for Business",
    issuer: "AISIN Asia Pacific Co., Ltd. — DX Promotion",
    year: "2026-05-20",
  },
  {
    id: "cred-009",
    type: "certification",
    title: "JavaScript Essentials 2",
    issuer: "Cisco Networking Academy & OpenEDG JavaScript Institute",
    year: "2026-08-26",
  },
  {
    id: "cred-010",
    type: "certification",
    title: "Prompt Engineering",
    issuer: "Free Academy.ai",
    url: "https://freeacademy.ai/verify/FA-2026-PE-PZCA9G",
    year: "2026-06-09",
  },
  {
    id: "cred-011",
    type: "certification",
    title: "JavaScript Essentials 1",
    issuer: "Cisco",
    year: "2025-06",
  },
  {
    id: "cred-012",
    type: "certification",
    title: "Foundations: Data, Data Everywhere",
    issuer: "Coursera",
    year: "2024-12",
  },
  {
    id: "cred-013",
    type: "certification",
    title: "Endpoint Security",
    issuer: "Cisco",
    year: "2024-11",
  },
  {
    id: "cred-014",
    type: "certification",
    title: "Cyber Threat Management",
    issuer: "Cisco",
    year: "2024-11",
  },
  {
    id: "cred-015",
    type: "certification",
    title: "Introduction to Career Skills in Data Analytics",
    issuer: "LinkedIn",
    year: "2024-10",
  }
];

// --- CV ---

export const cvSections: CVSection[] = [
  {
    id: "summary",
    title: "Professional Summary",
    items: [
      {
        label: "",
        detail: "Software Engineer experienced in building, deploying, and supporting production enterprise applications. Hands-on experience across system design, full-stack development, REST APIs, database design, application security, testing, CI/CD, and production support. Strongest in C#, ASP.NET Core, React, TypeScript, and SQL Server, with experience delivering secure enterprise systems, external integrations, and production deployments."
      },
    ],
  },
  {
    id: "experience",
    title: "Experience",
    items: [
      {
        label: "Fullstack Developer — Automotive parts manufacturer, Philippines",
        detail: "Built and deployed 3 production enterprise applications serving 1000 employees, owning development across requirements analysis, system design, implementation, testing, deployment, and production support. Diagnosed and resolved production failures in a legacy enterprise invoice-processing system integrated with an external electronic invoicing API, tracing issues across application code, database state, API behavior, authentication, and external documentation. Coordinated with external developers and platform support to validate fixes, manage integration credentials and certificates, and deploy validated changes through IIS. Developed an Employee Self-Service Portal used by 1000 employees, with 60+ REST API endpoints, enterprise HR-data integration, cross-application SSO, JWT authentication, role-based authorization, and Redis caching. Built a Transportation Reimbursement System used by 200+ employees, implementing map-verified routes, multi-level approval workflows, automated PDF/Excel generation, dashboards, and real-time notifications. Developed an Environmental Compliance Monitoring System that evaluates wastewater measurements against regulatory and internal standards through centralized business rules, automatically classifying results, maintaining audit history, and triggering critical-value notifications. Implemented application security using JWT, HttpOnly cookies, RBAC, CSRF protection, refresh-token rotation, password hashing, and rate limiting. Automated application build, test, and deployment workflows using GitHub Actions, deploying ASP.NET Core applications to IIS.",
        period: "Oct 2025 — Present"
      },
      {
        label: "Freelance Fullstack Developer — Self-Employed",
        detail: "Translated client requirements into technical specifications, application designs, and production-ready web applications. Developed and deployed applications using React, Next.js, TypeScript, Tailwind CSS, and REST APIs.",
        period: "May 2025 — Sept 2025"
      },
      {
        label: "System Development Intern — Municipal Health Office",
        detail: "Replaced manual workflows with internal software systems that centralized operational records and reduced repetitive data entry. Developed and deployed an inventory management system using JavaScript, PHP, and Electron.",
        period: "Feb 2025 — May 2025"
      },
    ],
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
    ],
  },
  {
    id: "skills",
    title: "Technical Skills",
    items: [
      {
        label: "Programming",
        detail: "C#, TypeScript, JavaScript, Python, SQL"
      },
      {
        label: "Frontend",
        detail: "React, Next.js, Vite, Tailwind CSS, Redux Toolkit, TanStack Query"
      },
      {
        label: "Backend",
        detail: "ASP.NET Core, .NET 8, Entity Framework Core, FastAPI, Node.js, REST APIs, SignalR"
      },
      {
        label: "Databases & Infrastructure",
        detail: "SQL Server, SQLite, Redis, Docker, IIS"
      },
      {
        label: "Testing & Security",
        detail: "xUnit, Moq, Vitest, React Testing Library, JWT, RBAC, CSRF, BCrypt"
      },
      {
        label: "DevOps & Integrations",
        detail: "GitHub Actions, Microsoft Dynamics 365, BIR EIS, Google Gemini API, OSV, NIST NVD"
      },
    ],
  },
  {
    id: "certifications",
    title: "Certifications",
    items: [
      {
        label: "Foundational C# with Microsoft – Developer Certification",
        detail: "freeCodeCamp & Microsoft",
        period: "Nov 2025"
      },
      {
        label: "JavaScript Essentials 2",
        detail: "Cisco Networking Academy & OpenEDG",
        period: "Aug 2026"
      },
      {
        label: "Endpoint Security",
        detail: "Cisco",
        period: "Nov 2024"
      },
      {
        label: "Cyber Threat Management",
        detail: "Cisco",
        period: "Nov 2024"
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
        period: "2021 — 2025"
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
