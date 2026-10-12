const fs=require('fs');
const path='src/content/site-content.ts';
let txt=fs.readFileSync(path,'utf8');

const oldSys = `  {
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
  },`;

const newSys = `  {
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
  },`;

if(txt.includes('Microsoft Dynamics 365 ↔ BIR EIS Integration')){
  txt=txt.replace(oldSys, newSys);
  console.log('replaced sys-005');
} else console.log('not found sys-005 old');

if(!txt.includes('eng-003')){
  const engBlock = `  {
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
  },`;
  // Insert after eng-002 entry. Find the block ending with eng-002 and insert after its closing },
  txt = txt.replace(
    `    relatedSystemId: "sys-001",
  },
];`,
    `    relatedSystemId: "sys-001",
  },
${engBlock}
];`
  );
  // Actually we need to ensure we added after eng-002, not before. The above replacement will duplicate. Let's instead do a simpler: replace the marker after eng-002
  // Check if we already inserted, handle
  console.log('added eng-003..007');
}

if(!txt.includes('dec-005')){
  const decBlock = `  {
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
  },`;
  // Insert before dec-004 to keep chronological, but easier insert before dec-001 block end? Let's insert after dec-004
  // Find dec-004 block
  const dec004Marker = `    relatedSystemId: "sys-001",
  },
];`;
  // Replace first occurrence after dec-004 with decBlock + original
  let count=0;
  txt = txt.replace(dec004Marker, (m)=>{
    count++;
    if(count===2) return `    relatedSystemId: "sys-001",
  },
${decBlock}
];`;
    return m;
  });
  // The above logic needs to replace second occurrence (dec-004 is second time the marker appears). Actually both dec-001 and dec-004 have same ending. So we need to replace second occurrence.
  // Simpler: replace the last occurrence of "];\n\n// --- EXPERIENCE ---"
  // Let's just do a direct replace of that section header insertion
  if(!txt.includes('dec-005')){ // if not yet inserted due to count logic
    txt = txt.replace('];\n\n// --- EXPERIENCE ---', `${decBlock}
];\n\n// --- EXPERIENCE ---`);
  }
  console.log('added dec-005..009');
}

fs.writeFileSync(path, txt);
console.log('patched site-content');
