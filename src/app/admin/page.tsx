"use client";

import { useState, useEffect, useMemo } from "react";

type SectionKey =
  | "dashboard"
  | "identity"
  | "proofStrip"
  | "now"
  | "projects"
  | "engLog"
  | "decLog"
  | "experience"
  | "stack"
  | "cv"
  | "articles"
  | "lifeOutside"
  | "credentials"
  | "neural"
  | "media"
  | "drafts"
  | "preview"
  | "published"
  | "users"
  | "audit"
  | "settings";

type NavGroup = { label: string; items: { key: SectionKey; label: string; desc?: string }[] } | { label: string; key: SectionKey };

const NAV: NavGroup[] = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Home", items: [
    { key: "identity", label: "Identity", desc: "Name, role, thesis, links" },
    { key: "proofStrip", label: "Proof Strip", desc: "KPI strip" },
    { key: "now", label: "Now", desc: "Building / Learning / Exploring" },
  ]},
  { label: "Work", items: [
    { key: "projects", label: "Projects", desc: "Systems / Portfolio" },
    { key: "engLog", label: "Engineering Log", desc: "Debugging narratives" },
    { key: "decLog", label: "Decision Log", desc: "ADR records" },
  ]},
  { label: "Profile", items: [
    { key: "experience", label: "Experience", desc: "Work history" },
    { key: "stack", label: "Stack", desc: "Neural map & categories" },
    { key: "cv", label: "CV", desc: "CV sections" },
    { key: "neural", label: "Neural Map", desc: "Tech personalities" },
  ]},
  { label: "Community", items: [
    { key: "articles", label: "Articles", desc: "Blog posts" },
    { key: "lifeOutside", label: "Life Outside", desc: "Hobbies / Music / Manhwa" },
  ]},
  { label: "Media", items: [{ key: "media", label: "Image Library" }] },
  { label: "Publishing", items: [
    { key: "drafts", label: "Drafts" },
    { key: "preview", label: "Preview" },
    { key: "published", label: "Published" },
  ]},
  { label: "System", items: [
    { key: "credentials", label: "Credentials" },
    { key: "users", label: "Users" },
    { key: "audit", label: "Audit Log" },
    { key: "settings", label: "Settings" },
  ]},
];

const fileMap: Record<SectionKey, string | null> = {
  dashboard: null,
  identity: "identity",
  proofStrip: "proofStrip",
  now: "now",
  projects: "systems",
  engLog: "engineeringLog",
  decLog: "decisionLog",
  experience: "experience",
  stack: "stack",
  cv: "cvSections",
  neural: "stack",
  articles: "blogPosts",
  lifeOutside: "lifeOutside",
  credentials: "credentials",
  media: null,
  drafts: "blogPosts",
  preview: "blogPosts",
  published: "blogPosts",
  users: null,
  audit: null,
  settings: null,
};

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] tracking-widest text-zinc-500">{label}</span>
      {hint && <span className="ml-2 font-mono text-[10px] text-zinc-400">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
const inputCls = "w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none";
const textareaCls = "w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 min-h-[88px] focus:border-zinc-600 focus:outline-none";
const selectCls = "w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none";

export default function AdminPage() {
  const [active, setActive] = useState<SectionKey>("dashboard");
  const [items, setItems] = useState<any[]>([]);
  const [single, setSingle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [systemsList, setSystemsList] = useState<any[]>([]);

  const file = fileMap[active];
  const isSingle = active === "identity" || active === "now" || active === "proofStrip";
  const isArray = !isSingle && file !== null && !["media","users","audit","settings","dashboard","neural"].includes(active);

  async function load() {
    if (!file) { setItems([]); setSingle(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/content?type=${file}`, { cache: "no-store" });
      const data = await res.json();
      if (isSingle) {
        setSingle(data);
        setItems([]);
      } else {
        const arr = Array.isArray(data) ? data : [];
        let filtered = arr;
        if (active === "drafts") filtered = arr.filter((x: any) => x.status === "draft" || x.draft === true);
        if (active === "published") filtered = arr.filter((x: any) => x.status !== "draft" && x.draft !== true);
        setItems(filtered);
      }
    } catch { setItems([]); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [active]);
  useEffect(() => {
    fetch("/api/content?type=systems", { cache: "no-store" }).then(r=>r.json()).then(d=> setSystemsList(Array.isArray(d)? d : [])).catch(()=>{});
  }, []);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((it) => JSON.stringify(it).toLowerCase().includes(q));
  }, [items, query]);

  async function saveSingle(obj: any) {
    if (!file) return;
    await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: file, fields: obj, _overwrite: true }),
    });
    await load();
  }

  async function handleSave(obj: any) {
    if (!file) return;
    const isNew = !items.find((x) => x.id === obj.id);
    const method = isNew ? "POST" : "PUT";
    const body = isNew ? { type: file, fields: obj, id: obj.id } : { type: file, id: obj.id, fields: obj };
    const res = await fetch("/api/content", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error("save failed");
    setEditing(null);
    await load();
  }
  async function handleDelete(id: string) {
    if (!file || !confirm("Delete?")) return;
    await fetch(`/api/content?type=${file}&id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex">
      {/* Sidebar - isolated admin */}
      <aside className="w-[300px] shrink-0 border-r border-zinc-800 bg-zinc-900/40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500">PORTFOLIO ADMIN</p>
          <h1 className="text-sm font-medium mt-1">Content Studio</h1>
          <p className="text-xs text-zinc-500 mt-2">Grouped by portfolio nav • calendar for dates • every detail editable</p>
          <button
            onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }}
            className="mt-4 w-full border border-zinc-700 px-3 py-1.5 font-mono text-xs hover:bg-zinc-800"
          >
            Sign out
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {NAV.map((g: any) =>
            g.key ? (
              <button
                key={g.key}
                onClick={() => setActive(g.key)}
                className={`w-full text-left px-3 py-2 text-sm font-medium border ${active === g.key ? "bg-white text-black border-white" : "border-zinc-800 hover:bg-zinc-800 text-zinc-300"}`}
              >
                {g.label}
              </button>
            ) : (
              <div key={g.label}>
                <p className="font-mono text-[10px] tracking-widest text-zinc-500 mb-2">{g.label}</p>
                <div className="space-y-1">
                  {g.items.map((it: any) => (
                    <button
                      key={it.key}
                      onClick={() => setActive(it.key)}
                      className={`w-full text-left px-3 py-2 border text-sm ${active === it.key ? "bg-white text-black border-white" : "bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300"}`}
                    >
                      <span className="block font-medium">{it.label}</span>
                      {it.desc && <span className="block font-mono text-[10px] text-zinc-500">{it.desc}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <p className="font-mono text-[10px] text-zinc-500">Data: <span className="text-zinc-300">src/data/*.json</span> • API: <span className="text-zinc-300">/api/content</span></p>
        </div>
      </aside>

      {/* Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-2 flex gap-2 overflow-x-auto z-20">
        {["dashboard","projects","articles","stack","credentials"].map(k=>(
          <button key={k} onClick={()=>setActive(k as SectionKey)} className={`px-3 py-1.5 text-xs capitalize border whitespace-nowrap ${active===k?"bg-white text-black":"bg-zinc-800 text-zinc-300 border-zinc-700"}`}>{k}</button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 bg-[#0a0a0a] p-6 lg:p-8 pb-20 lg:pb-8 overflow-auto">
        {active === "dashboard" && <Dashboard />}

        {active === "media" && <MediaLibrary />}
        {active === "users" && <Placeholder title="Users" desc="Single admin now. Add Users table later (email, role, invite). Protected by ADMIN_PASSWORD." />}
        {active === "audit" && <Placeholder title="Audit Log" desc="Every write logs to src/data/audit.json with timestamp, user, IP. View tail here." />}
        {active === "settings" && <SettingsPanel />}
        {active === "neural" && <NeuralEditor stack={items} />}

        {/* Single object editors */}
        {isSingle && file && (
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] tracking-widest text-zinc-500">{active}</p>
            <h2 className="text-xl font-medium mt-1 capitalize">{active} <span className="font-mono text-xs text-zinc-500">{file}.json</span></h2>
            {loading ? <p className="text-sm text-zinc-500 mt-6">Loading…</p> : single && (
              <div className="mt-6">
                {active === "identity" && <IdentityForm data={single} onSave={(v)=> saveSingle(v)} />}
                {active === "now" && <NowForm data={single} onSave={(v)=> saveSingle(v)} />}
                {active === "proofStrip" && <ProofStripForm data={Array.isArray(single)? single : []} onSave={(v)=> saveSingle(v)} />}
              </div>
            )}
          </div>
        )}

        {/* Array editors */}
        {isArray && (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-zinc-500">{active}</p>
                <h2 className="text-xl font-medium capitalize">{active} <span className="font-mono text-xs text-zinc-500">{file}.json</span></h2>
                <p className="text-sm text-zinc-400 mt-1">
                  {active==="projects" && "Full system: name, function, stack[], status, summary, narrative, sellingPoints[], insideBuild, architecture"}
                  {active==="articles" && "Blog: title, date (calendar), tag, excerpt, body[]"}
                  {active==="experience" && "Experience: role, company, period, outcomes[], systemIds[]"}
                  {active==="stack" && "Stack: name, category, tier 1-4, projectIds[] — powers Neural Map"}
                  {active==="lifeOutside" && "Life Outside: category, title, detail, url"}
                  {active==="credentials" && "Credentials: type, title, issuer, url, year"}
                  {active==="cv" && "CV sections: title, items[]"}
                  {active==="engLog" && "Engineering Log: date (calendar), problem, investigation, rootCause…"}
                  {active==="decLog" && "Decision Log: decision, why, alternative, tradeoff…"}
                </p>
              </div>
              <div className="flex gap-2">
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search…" className="bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm w-48" />
                <button
                  onClick={()=> setEditing({ id: crypto.randomUUID(), _isNew: true })}
                  className="bg-white text-black px-4 py-2 text-sm font-medium hover:bg-zinc-200"
                >
                  + New
                </button>
              </div>
            </div>

            {editing && (
              <div className="border border-white bg-zinc-900 p-6 mb-6">
                <h3 className="font-mono text-xs tracking-widest text-zinc-400 mb-4">{editing._isNew ? "NEW" : `EDIT ${editing.id?.slice(0,8)}`} — {file}</h3>
                {active==="articles" && <BlogForm data={editing} onSave={handleSave} onCancel={()=>setEditing(null)} />}
                {active==="projects" && <ProjectForm data={editing} systemsList={systemsList} onSave={handleSave} onCancel={()=>setEditing(null)} />}
                {active==="stack" && <StackForm data={editing} systemsList={systemsList} onSave={handleSave} onCancel={()=>setEditing(null)} />}
                {active==="experience" && <ExperienceForm data={editing} systemsList={systemsList} onSave={handleSave} onCancel={()=>setEditing(null)} />}
                {active==="lifeOutside" && <LifeForm data={editing} onSave={handleSave} onCancel={()=>setEditing(null)} />}
                {active==="credentials" && <CredentialForm data={editing} onSave={handleSave} onCancel={()=>setEditing(null)} />}
                {active==="cv" && <CvForm data={editing} onSave={handleSave} onCancel={()=>setEditing(null)} />}
                {active==="engLog" && <EngLogForm data={editing} systemsList={systemsList} onSave={handleSave} onCancel={()=>setEditing(null)} />}
                {active==="decLog" && <DecLogForm data={editing} systemsList={systemsList} onSave={handleSave} onCancel={()=>setEditing(null)} />}
                {(active==="drafts"||active==="preview"||active==="published") && <BlogForm data={editing} onSave={handleSave} onCancel={()=>setEditing(null)} />}
              </div>
            )}

            {loading ? <p className="text-sm text-zinc-500">Loading…</p> : filtered.length===0 ? (
              <div className="border border-dashed border-zinc-700 p-12 text-center">
                <p className="text-sm text-zinc-400">No items. Existing content is seeded from site-content.ts — try search clear or + New.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filtered.map((it:any)=>(
                  <div key={it.id || it.name} className="border border-zinc-800 bg-zinc-900/50 p-4 flex gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{it.title || it.name || it.label || it.id}</p>
                      <p className="text-xs text-zinc-400 truncate mt-1">{it.excerpt || it.summary || it.detail || it.function || it.problem || it.decision || ""}</p>
                      <p className="font-mono text-[10px] text-zinc-500 mt-2">{it.id || it.name} • {it.date || it.period || it.tag || it.status || it.category || it.type || ""}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={()=>setEditing(it)} className="border border-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-800">Edit</button>
                      <button onClick={()=>handleDelete(it.id || it.name)} className="border border-red-900/50 text-red-400 px-3 py-1.5 text-xs hover:bg-red-950/30">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Dashboard(){
  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest text-zinc-500">Dashboard</p>
      <h2 className="text-xl font-medium mt-1">Portfolio Studio</h2>
      <p className="text-sm text-zinc-400 mt-2">Everything editable, grouped by portfolio nav. Calendar for dates, full existing content seeded.</p>
      <div className="grid gap-4 md:grid-cols-3 mt-6">
        {[
          {k:"Work", v:"5 Systems", d:"Wastewater, Employee Portal, Transpo, Cipher, D365-BIR"},
          {k:"Profile", v:"38 Stack items", d:"Core 1 → AI-Exploration 4, neural map"},
          {k:"Community", v:"0 Articles + 4 Life", d:"Blog empty — add first post"},
        ].map(s=>(
          <div key={s.k} className="border border-zinc-800 bg-zinc-900 p-4">
            <p className="font-mono text-[10px] text-zinc-500">{s.k}</p>
            <p className="font-medium mt-1">{s.v}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.d}</p>
          </div>
        ))}
      </div>
      <div className="border border-zinc-800 bg-zinc-900 p-5 mt-6">
        <h3 className="font-mono text-xs tracking-widest text-zinc-400">How publishing works</h3>
        <ol className="list-decimal ml-5 mt-3 text-sm text-zinc-400 space-y-1">
          <li><span className="font-mono text-zinc-200">src/data/*.json</span> seeded from site-content.ts — edit here.</li>
          <li>Admin writes via <span className="font-mono text-zinc-200">/api/content</span> (protected by ADMIN_PASSWORD).</li>
          <li>Public pages read from <span className="font-mono text-zinc-200">site-content.ts</span> today — wire to <span className="font-mono text-zinc-200">src/data</span> when ready.</li>
          <li>Media → <span className="font-mono text-zinc-200">public/uploads</span> via future /api/media.</li>
        </ol>
      </div>
    </div>
  );
}
function MediaLibrary(){
  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest text-zinc-500">Media</p>
      <h2 className="text-xl font-medium mt-1">Image Library</h2>
      <div className="border border-dashed border-zinc-700 p-8 mt-6 text-center">
        <p className="text-sm text-zinc-300">Drop images → <span className="font-mono">public/uploads</span></p>
        <p className="text-xs text-zinc-500 mt-1">Wire to /api/media later. For now use URL fields.</p>
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[1,2,3].map(i=><div key={i} className="aspect-video bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-xs text-zinc-600">placeholder {i}</div>)}
        </div>
      </div>
    </div>
  );
}
function Placeholder({title,desc}:{title:string;desc:string}){
  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest text-zinc-500">System</p>
      <h2 className="text-xl font-medium mt-1">{title}</h2>
      <div className="border border-zinc-800 bg-zinc-900 p-6 mt-6">
        <p className="text-sm text-zinc-400">{desc}</p>
      </div>
    </div>
  );
}
function SettingsPanel(){
  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest text-zinc-500">System</p>
      <h2 className="text-xl font-medium mt-1">Settings</h2>
      <div className="border border-zinc-800 bg-zinc-900 p-6 mt-6 space-y-4">
        <Field label="Site title"><input className={inputCls} defaultValue="Engineering Profile" /></Field>
        <Field label="Admin password env"><input className={inputCls} value="ADMIN_PASSWORD=Darkgray0323! (hidden)" readOnly /></Field>
        <p className="font-mono text-xs text-zinc-500">Change in .env.local and restart dev server. Protected by middleware.</p>
      </div>
    </div>
  );
}
function NeuralEditor({stack}:{stack:any[]}){
  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest text-zinc-500">Labs • Profile</p>
      <h2 className="text-xl font-medium mt-1">Neural Map — Stack</h2>
      <p className="text-sm text-zinc-400 mt-2">This *is* the neural tech stack. Edit <span className="font-mono">stack.json</span> here — name, category, tier 1-4, projectIds.</p>
      <div className="mt-6 border border-zinc-800 bg-zinc-900 p-4">
        <p className="font-mono text-xs text-zinc-400">Use Profile → Stack section to edit. This view previews how items render on /neural-map and /stack.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {stack.slice(0,6).map((s:any, idx:number)=>(
            <div key={`${s.name}-${idx}`} className="border border-zinc-800 bg-zinc-950 p-3">
              <p className="font-mono text-xs">{s.name} <span className="text-zinc-500">• {s.category} • tier {s.tier}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Forms ----
function IdentityForm({data,onSave}:{data:any; onSave:(v:any)=>void}){
  const [f,setF]=useState(data);
  return (
    <div className="space-y-4">
      <Field label="Name"><input className={inputCls} value={f.name||""} onChange={e=>setF({...f,name:e.target.value})} /></Field>
      <Field label="Role"><input className={inputCls} value={f.role||""} onChange={e=>setF({...f,role:e.target.value})} /></Field>
      <Field label="Thesis" hint="long"><textarea className={textareaCls} value={f.thesis||""} onChange={e=>setF({...f,thesis:e.target.value})} /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Experience start" hint="calendar"><input type="date" className={inputCls} value={f.experienceStart||""} onChange={e=>setF({...f,experienceStart:e.target.value})} /></Field>
        <Field label="Development start" hint="calendar"><input type="date" className={inputCls} value={f.developmentStart||""} onChange={e=>setF({...f,developmentStart:e.target.value})} /></Field>
      </div>
      <Field label="Email"><input className={inputCls} value={f.email||""} onChange={e=>setF({...f,email:e.target.value})} /></Field>
      <Field label="GitHub"><input className={inputCls} value={f.github||""} onChange={e=>setF({...f,github:e.target.value})} /></Field>
      <Field label="LinkedIn"><input className={inputCls} value={f.linkedin||""} onChange={e=>setF({...f,linkedin:e.target.value})} /></Field>
      <button onClick={()=>onSave(f)} className="bg-white text-black px-4 py-2 text-sm font-medium">Save identity</button>
    </div>
  );
}
function NowForm({data,onSave}:{data:any; onSave:(v:any)=>void}){
  const [f,setF]=useState(data);
  return (
    <div className="space-y-4">
      <Field label="Building"><textarea className={textareaCls} value={f.building||""} onChange={e=>setF({...f,building:e.target.value})} /></Field>
      <Field label="Learning"><textarea className={textareaCls} value={f.learning||""} onChange={e=>setF({...f,learning:e.target.value})} /></Field>
      <Field label="Exploring"><textarea className={textareaCls} value={f.exploring||""} onChange={e=>setF({...f,exploring:e.target.value})} /></Field>
      <button onClick={()=>onSave(f)} className="bg-white text-black px-4 py-2 text-sm font-medium">Save Now</button>
    </div>
  );
}
function ProofStripForm({data,onSave}:{data:any[]; onSave:(v:any)=>void}){
  const [items,setItems]=useState(data);
  return (
    <div className="space-y-3">
      {items.map((it:any,idx:number)=>(
        <div key={idx} className="flex gap-2">
          <input className={inputCls} value={it.label} onChange={e=>{ const a=[...items]; a[idx]={...a[idx],label:e.target.value}; setItems(a); }} placeholder="Label" />
          <input className={inputCls} value={it.value} onChange={e=>{ const a=[...items]; a[idx]={...a[idx],value:e.target.value}; setItems(a); }} placeholder="Value" />
          <button onClick={()=> setItems(items.filter((_,i)=>i!==idx))} className="border border-zinc-700 px-3 text-xs">×</button>
        </div>
      ))}
      <button onClick={()=> setItems([...items,{label:"",value:""}])} className="border border-zinc-700 px-3 py-1 text-xs">+ Add</button>
      <button onClick={()=>onSave(items)} className="bg-white text-black px-4 py-2 text-sm font-medium">Save</button>
    </div>
  );
}
function BlogForm({data,onSave,onCancel}:{data:any; onSave:(v:any)=>void; onCancel:()=>void}){
  const [f,setF]=useState({ id: data.id||crypto.randomUUID(), title: data.title||"", date: data.date||new Date().toISOString().slice(0,10), tag: data.tag||"", excerpt: data.excerpt||"", body: Array.isArray(data.body)? data.body : [], status: data.status||"published" });
  return (
    <div className="space-y-4">
      <Field label="ID"><input className={inputCls} value={f.id} onChange={e=>setF({...f,id:e.target.value})} /></Field>
      <Field label="Title"><input className={inputCls} value={f.title} onChange={e=>setF({...f,title:e.target.value})} /></Field>
      <div className="grid md:grid-cols-3 gap-4">
        <Field label="Date" hint="calendar"><input type="date" className={inputCls} value={f.date} onChange={e=>setF({...f,date:e.target.value})} /></Field>
        <Field label="Tag"><input className={inputCls} value={f.tag} onChange={e=>setF({...f,tag:e.target.value})} /></Field>
        <Field label="Status"><select className={selectCls} value={f.status} onChange={e=>setF({...f,status:e.target.value})}><option value="published">published</option><option value="draft">draft</option></select></Field>
      </div>
      <Field label="Excerpt"><textarea className={textareaCls} value={f.excerpt} onChange={e=>setF({...f,excerpt:e.target.value})} /></Field>
      <Field label="Body" hint="one paragraph per line"><textarea className={textareaCls} value={f.body.join("\n\n")} onChange={e=>setF({...f,body:e.target.value.split("\n\n")})} rows={6} /></Field>
      <div className="flex gap-2">
        <button onClick={()=>onSave(f)} className="bg-white text-black px-4 py-2 text-sm">Save</button>
        <button onClick={onCancel} className="border border-zinc-700 px-4 py-2 text-sm">Cancel</button>
      </div>
    </div>
  );
}
function ProjectForm({data,systemsList,onSave,onCancel}:{data:any; systemsList:any[]; onSave:(v:any)=>void; onCancel:()=>void}){
  const [f,setF]=useState({
    id: data.id||`sys-${Date.now()}`,
    name: data.name||"",
    function: data.function||"",
    stackText: Array.isArray(data.stack)? data.stack.join(", ") : data.stack||"",
    status: data.status||"production",
    summary: data.summary||"",
    narrative: data.narrative||"",
    sellingPointsText: Array.isArray(data.sellingPoints)? data.sellingPoints.join("\n") : "",
    architecture: data.architecture ? JSON.stringify(data.architecture,null,2) : "",
    insideBuild: data.insideBuild ? JSON.stringify(data.insideBuild,null,2) : "",
  });
  return (
    <div className="space-y-4">
      <Field label="ID"><input className={inputCls} value={f.id} onChange={e=>setF({...f,id:e.target.value})} /></Field>
      <Field label="Name"><input className={inputCls} value={f.name} onChange={e=>setF({...f,name:e.target.value})} /></Field>
      <Field label="Function"><input className={inputCls} value={f.function} onChange={e=>setF({...f,function:e.target.value})} /></Field>
      <Field label="Stack" hint="comma separated"><input className={inputCls} value={f.stackText} onChange={e=>setF({...f,stackText:e.target.value})} /></Field>
      <Field label="Status"><select className={selectCls} value={f.status} onChange={e=>setF({...f,status:e.target.value})}><option value="production">production</option><option value="development">development</option><option value="archived">archived</option></select></Field>
      <Field label="Summary"><textarea className={textareaCls} value={f.summary} onChange={e=>setF({...f,summary:e.target.value})} /></Field>
      <Field label="Narrative"><textarea className={textareaCls} value={f.narrative} onChange={e=>setF({...f,narrative:e.target.value})} rows={4} /></Field>
      <Field label="Selling points" hint="one per line"><textarea className={textareaCls} value={f.sellingPointsText} onChange={e=>setF({...f,sellingPointsText:e.target.value})} rows={4} /></Field>
      <Field label="Architecture JSON" hint="nodes, connections"><textarea className={textareaCls + " font-mono text-xs"} value={f.architecture} onChange={e=>setF({...f,architecture:e.target.value})} rows={4} placeholder='{"nodes":[],"connections":[]}' /></Field>
      <Field label="InsideBuild JSON"><textarea className={textareaCls + " font-mono text-xs"} value={f.insideBuild} onChange={e=>setF({...f,insideBuild:e.target.value})} rows={4} /></Field>
      <div className="flex gap-2">
        <button
          onClick={()=>{
            let arch: any = undefined; let ib: any = undefined;
            try{ if(f.architecture) arch=JSON.parse(f.architecture);}catch{ alert("Invalid architecture JSON"); return; }
            try{ if(f.insideBuild) ib=JSON.parse(f.insideBuild);}catch{ alert("Invalid insideBuild JSON"); return; }
            onSave({
              id:f.id, name:f.name, function:f.function, stack: f.stackText.split(",").map((s:string)=>s.trim()).filter(Boolean),
              status:f.status, summary:f.summary, narrative:f.narrative,
              sellingPoints: f.sellingPointsText.split("\n").map((s:string)=>s.trim()).filter(Boolean),
              ...(arch?{architecture:arch}:{}), ...(ib?{insideBuild:ib}:{})
            });
          }}
          className="bg-white text-black px-4 py-2 text-sm">Save</button>
        <button onClick={onCancel} className="border border-zinc-700 px-4 py-2 text-sm">Cancel</button>
      </div>
    </div>
  );
}
function StackForm({data,systemsList,onSave,onCancel}:{data:any; systemsList:any[]; onSave:(v:any)=>void; onCancel:()=>void}){
  const [f,setF]=useState({ name: data.name||"", category: data.category||"core", tier: data.tier||1, projectIds: Array.isArray(data.projectIds)? data.projectIds : [] });
  return (
    <div className="space-y-4">
      <Field label="Name"><input className={inputCls} value={f.name} onChange={e=>setF({...f,name:e.target.value})} /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Category"><select className={selectCls} value={f.category} onChange={e=>setF({...f,category:e.target.value})}><option value="core">core</option><option value="supporting">supporting</option><option value="data">data</option><option value="infra">infra</option><option value="testing">testing</option><option value="integrations">integrations</option><option value="ai-exploration">ai-exploration</option></select></Field>
        <Field label="Tier"><select className={selectCls} value={String(f.tier)} onChange={e=>setF({...f,tier: Number(e.target.value)})}><option value="1">1 - Daily</option><option value="2">2 - Supporting</option><option value="3">3 - Infra</option><option value="4">4 - AI Exploration</option></select></Field>
      </div>
      <Field label="Projects" hint="neural map links"><div className="grid grid-cols-2 gap-2 max-h-32 overflow-auto border border-zinc-800 p-2 bg-zinc-950">{systemsList.map(s=>(
        <label key={s.id} className="flex gap-2 text-xs"><input type="checkbox" checked={f.projectIds.includes(s.id)} onChange={e=> setF({...f, projectIds: e.target.checked? [...f.projectIds,s.id] : f.projectIds.filter((x:string)=>x!==s.id)})} />{s.name}</label>
      ))}</div></Field>
      <div className="flex gap-2"><button onClick={()=>onSave(f)} className="bg-white text-black px-4 py-2 text-sm">Save</button><button onClick={onCancel} className="border border-zinc-700 px-4 py-2 text-sm">Cancel</button></div>
    </div>
  );
}
function parsePeriod(period: string) {
  const parts = period.split("—").map(s=>s.trim());
  const toMonth = (s: string) => {
    if (!s || s.toLowerCase()==="present") return "";
    const m: Record<string,string> = { jan:"01", feb:"02", mar:"03", apr:"04", may:"05", jun:"06", jul:"07", aug:"08", sep:"09", sept:"09", oct:"10", nov:"11", dec:"12" };
    const pm = s.match(/([A-Za-z]+)\s+(\d{4})/);
    if (!pm) return "";
    const mon = m[pm[1].toLowerCase().slice(0,4)] || m[pm[1].toLowerCase().slice(0,3)] || "01";
    return `${pm[2]}-${mon}`;
  };
  return { start: toMonth(parts[0]||""), end: toMonth(parts[1]||""), isPresent: (parts[1]||"").toLowerCase()==="present" };
}
function formatPeriod(start: string, end: string, isPresent: boolean) {
  const fmt = (ym: string) => {
    if (!ym) return "";
    const [y,m] = ym.split("-");
    const names = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
    return `${names[Number(m)]} ${y}`;
  };
  const a = fmt(start);
  const b = isPresent ? "Present" : fmt(end);
  return b ? `${a} — ${b}` : a;
}
function ExperienceForm({data,systemsList,onSave,onCancel}:{data:any; systemsList:any[]; onSave:(v:any)=>void; onCancel:()=>void}){
  const parsed = parsePeriod(data.period||"");
  const [f,setF]=useState({ id:data.id||`exp-${Date.now()}`, role:data.role||"", company:data.company||"", periodStart: parsed.start, periodEnd: parsed.end, isPresent: parsed.isPresent, outcomesText:Array.isArray(data.outcomes)? data.outcomes.join("\n") : "", systemIds:Array.isArray(data.systemIds)? data.systemIds: [] });
  return (
    <div className="space-y-4">
      <Field label="ID"><input className={inputCls} value={f.id} onChange={e=>setF({...f,id:e.target.value})} /></Field>
      <Field label="Role"><input className={inputCls} value={f.role} onChange={e=>setF({...f,role:e.target.value})} /></Field>
      <Field label="Company"><input className={inputCls} value={f.company} onChange={e=>setF({...f,company:e.target.value})} /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Start" hint="calendar"><input type="month" className={inputCls} value={f.periodStart} onChange={e=>setF({...f,periodStart:e.target.value})} /></Field>
        <Field label="End" hint="calendar">
          <div className="flex gap-2">
            <input type="month" className={inputCls} value={f.isPresent ? "" : f.periodEnd} onChange={e=>setF({...f,periodEnd:e.target.value})} disabled={f.isPresent} />
            <label className="flex items-center gap-1 text-xs whitespace-nowrap"><input type="checkbox" checked={f.isPresent} onChange={e=>setF({...f,isPresent:e.target.checked})} /> Present</label>
          </div>
        </Field>
      </div>
      <p className="font-mono text-[10px] text-zinc-500">Preview: {formatPeriod(f.periodStart, f.periodEnd, f.isPresent) || "—"}</p>
      <Field label="Outcomes" hint="one per line"><textarea className={textareaCls} value={f.outcomesText} onChange={e=>setF({...f,outcomesText:e.target.value})} rows={4} /></Field>
      <Field label="Linked Systems"><div className="flex flex-wrap gap-2 border border-zinc-800 p-2 bg-zinc-950">{systemsList.map(s=>(<label key={s.id} className="text-xs flex gap-1"><input type="checkbox" checked={f.systemIds.includes(s.id)} onChange={e=> setF({...f, systemIds: e.target.checked? [...f.systemIds,s.id]: f.systemIds.filter((x:string)=>x!==s.id)})} />{s.id}</label>))}</div></Field>
      <div className="flex gap-2"><button onClick={()=>onSave({ id:f.id, role:f.role, company:f.company, period: formatPeriod(f.periodStart, f.periodEnd, f.isPresent), outcomes:f.outcomesText.split("\n").filter(Boolean), systemIds:f.systemIds })} className="bg-white text-black px-4 py-2 text-sm">Save</button><button onClick={onCancel} className="border border-zinc-700 px-4 py-2 text-sm">Cancel</button></div>
    </div>
  );
}
function LifeForm({data,onSave,onCancel}:{data:any; onSave:(v:any)=>void; onCancel:()=>void}){
  const [f,setF]=useState({ id:data.id||`lo-${Date.now()}`, category:data.category||"hobby", title:data.title||"", detail:data.detail||"", url:data.url||"" });
  return (
    <div className="space-y-4">
      <Field label="ID"><input className={inputCls} value={f.id} onChange={e=>setF({...f,id:e.target.value})} /></Field>
      <Field label="Category"><select className={selectCls} value={f.category} onChange={e=>setF({...f,category:e.target.value})}><option value="hobby">hobby</option><option value="music">music</option><option value="manhwa">manhwa</option><option value="blog">blog</option></select></Field>
      <Field label="Title"><input className={inputCls} value={f.title} onChange={e=>setF({...f,title:e.target.value})} /></Field>
      <Field label="Detail"><textarea className={textareaCls} value={f.detail} onChange={e=>setF({...f,detail:e.target.value})} /></Field>
      <Field label="URL"><input className={inputCls} value={f.url} onChange={e=>setF({...f,url:e.target.value})} /></Field>
      <div className="flex gap-2"><button onClick={()=>onSave(f)} className="bg-white text-black px-4 py-2 text-sm">Save</button><button onClick={onCancel} className="border border-zinc-700 px-4 py-2 text-sm">Cancel</button></div>
    </div>
  );
}
function CredentialForm({data,onSave,onCancel}:{data:any; onSave:(v:any)=>void; onCancel:()=>void}){
  const [f,setF]=useState({ id:data.id||`cred-${Date.now()}`, type:data.type||"link", title:data.title||"", issuer:data.issuer||"", url:data.url||"", year:data.year||"" });
  return (
    <div className="space-y-4">
      <Field label="ID"><input className={inputCls} value={f.id} onChange={e=>setF({...f,id:e.target.value})} /></Field>
      <Field label="Type"><select className={selectCls} value={f.type} onChange={e=>setF({...f,type:e.target.value})}><option value="certification">certification</option><option value="badge">badge</option><option value="link">link</option></select></Field>
      <Field label="Title"><input className={inputCls} value={f.title} onChange={e=>setF({...f,title:e.target.value})} /></Field>
      <Field label="Issuer"><input className={inputCls} value={f.issuer} onChange={e=>setF({...f,issuer:e.target.value})} /></Field>
      <Field label="URL"><input className={inputCls} value={f.url} onChange={e=>setF({...f,url:e.target.value})} /></Field>
      <Field label="Year"><input className={inputCls} value={f.year} onChange={e=>setF({...f,year:e.target.value})} /></Field>
      <div className="flex gap-2"><button onClick={()=>onSave(f)} className="bg-white text-black px-4 py-2 text-sm">Save</button><button onClick={onCancel} className="border border-zinc-700 px-4 py-2 text-sm">Cancel</button></div>
    </div>
  );
}
function CvForm({data,onSave,onCancel}:{data:any; onSave:(v:any)=>void; onCancel:()=>void}){
  const [f,setF]=useState({ id:data.id||`cv-${Date.now()}`, title:data.title||"", itemsText: Array.isArray(data.items)? JSON.stringify(data.items,null,2) : "[]" });
  return (
    <div className="space-y-4">
      <Field label="ID"><input className={inputCls} value={f.id} onChange={e=>setF({...f,id:e.target.value})} /></Field>
      <Field label="Title"><input className={inputCls} value={f.title} onChange={e=>setF({...f,title:e.target.value})} /></Field>
      <Field label="Items JSON" hint='[{label,detail,period}]'><textarea className={textareaCls + " font-mono text-xs"} value={f.itemsText} onChange={e=>setF({...f,itemsText:e.target.value})} rows={6} /></Field>
      <div className="flex gap-2"><button onClick={()=>{
        try{ const items=JSON.parse(f.itemsText); onSave({id:f.id,title:f.title,items}); } catch{ alert("Invalid JSON"); }
      }} className="bg-white text-black px-4 py-2 text-sm">Save</button><button onClick={onCancel} className="border border-zinc-700 px-4 py-2 text-sm">Cancel</button></div>
    </div>
  );
}
function EngLogForm({data,systemsList,onSave,onCancel}:{data:any; systemsList:any[]; onSave:(v:any)=>void; onCancel:()=>void}){
  const [f,setF]=useState({
    id:data.id||`eng-${Date.now()}`, title:data.title||"", date:data.date||new Date().toISOString().slice(0,7),
    problem:data.problem||"", investigation:data.investigation||"", rootCause:data.rootCause||"", solution:data.solution||"", result:data.result||"", lesson:data.lesson||"", relatedSystemId:data.relatedSystemId||""
  });
  return (
    <div className="space-y-3">
      <Field label="ID"><input className={inputCls} value={f.id} onChange={e=>setF({...f,id:e.target.value})} /></Field>
      <Field label="Title"><input className={inputCls} value={f.title} onChange={e=>setF({...f,title:e.target.value})} /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Date" hint="calendar"><input type="month" className={inputCls} value={f.date} onChange={e=>setF({...f,date:e.target.value})} /></Field>
        <Field label="Related System"><select className={selectCls} value={f.relatedSystemId} onChange={e=>setF({...f,relatedSystemId:e.target.value})}><option value="">— none —</option>{systemsList.map(s=><option key={s.id} value={s.id}>{s.id} • {s.name}</option>)}</select></Field>
      </div>
      <Field label="Problem"><textarea className={textareaCls} value={f.problem} onChange={e=>setF({...f,problem:e.target.value})} /></Field>
      <Field label="Investigation"><textarea className={textareaCls} value={f.investigation} onChange={e=>setF({...f,investigation:e.target.value})} /></Field>
      <Field label="Root cause"><textarea className={textareaCls} value={f.rootCause} onChange={e=>setF({...f,rootCause:e.target.value})} /></Field>
      <Field label="Solution"><textarea className={textareaCls} value={f.solution} onChange={e=>setF({...f,solution:e.target.value})} /></Field>
      <Field label="Result"><textarea className={textareaCls} value={f.result} onChange={e=>setF({...f,result:e.target.value})} /></Field>
      <Field label="Lesson"><textarea className={textareaCls} value={f.lesson} onChange={e=>setF({...f,lesson:e.target.value})} /></Field>
      <div className="flex gap-2"><button onClick={()=>onSave(f)} className="bg-white text-black px-4 py-2 text-sm">Save</button><button onClick={onCancel} className="border border-zinc-700 px-4 py-2 text-sm">Cancel</button></div>
    </div>
  );
}
function DecLogForm({data,systemsList,onSave,onCancel}:{data:any; systemsList:any[]; onSave:(v:any)=>void; onCancel:()=>void}){
  const [f,setF]=useState({
    id:data.id||`dec-${Date.now()}`, title:data.title||"", decision:data.decision||"", why:data.why||"", alternative:data.alternative||"", tradeoff:data.tradeoff||"", relatedSystemId:data.relatedSystemId||""
  });
  return (
    <div className="space-y-3">
      <Field label="ID"><input className={inputCls} value={f.id} onChange={e=>setF({...f,id:e.target.value})} /></Field>
      <Field label="Title"><input className={inputCls} value={f.title} onChange={e=>setF({...f,title:e.target.value})} /></Field>
      <Field label="Related System"><select className={selectCls} value={f.relatedSystemId} onChange={e=>setF({...f,relatedSystemId:e.target.value})}><option value="">— none —</option>{systemsList.map(s=><option key={s.id} value={s.id}>{s.id}</option>)}</select></Field>
      <Field label="Decision"><textarea className={textareaCls} value={f.decision} onChange={e=>setF({...f,decision:e.target.value})} /></Field>
      <Field label="Why"><textarea className={textareaCls} value={f.why} onChange={e=>setF({...f,why:e.target.value})} /></Field>
      <Field label="Alternative"><textarea className={textareaCls} value={f.alternative} onChange={e=>setF({...f,alternative:e.target.value})} /></Field>
      <Field label="Tradeoff"><textarea className={textareaCls} value={f.tradeoff} onChange={e=>setF({...f,tradeoff:e.target.value})} /></Field>
      <div className="flex gap-2"><button onClick={()=>onSave(f)} className="bg-white text-black px-4 py-2 text-sm">Save</button><button onClick={onCancel} className="border border-zinc-700 px-4 py-2 text-sm">Cancel</button></div>
    </div>
  );
}
