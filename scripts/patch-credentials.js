const fs=require('fs');
let txt=fs.readFileSync('src/content/site-content.ts','utf8');
const newCreds = `export const credentials: Credential[] = [
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
  },
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
];`;

const oldPattern = /export const credentials: Credential\[\] = \[[\s\S]*?\];/;
if(oldPattern.test(txt)){
  txt=txt.replace(oldPattern, newCreds);
  fs.writeFileSync('src/content/site-content.ts', txt);
  console.log('patched credentials');
} else console.log('not found');
