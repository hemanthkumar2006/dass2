import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useBusiness } from "../api/businessContext";
import {
  getAgent,
  updateAgent,
  uploadAgentDocument,
  deleteAgentDocument,
} from "../api/client";

/* ─── Tab icons ─────────────────────────────────────────────── */
const OverviewIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const KBIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
  </svg>
);
const WebIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const DocIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const EmptyDocIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)" }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="8 17 12 21 16 17" /><line x1="12" y1="21" x2="12" y2="3" />
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
  </svg>
);
const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ─── Toast component ───────────────────────────────────────── */
function Toast({ msg, type }) {
  if (!msg) return null;
  const bg = type === "error" ? "rgba(239,68,68,0.15)" : "rgba(74,222,128,0.15)";
  const color = type === "error" ? "#f87171" : "#4ade80";
  const border = type === "error" ? "rgba(239,68,68,0.3)" : "rgba(74,222,128,0.3)";
  return (
    <div style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 9999,
      background: bg, border: `1px solid ${border}`, color,
      borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 600,
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      animation: "fadeIn 0.2s ease",
    }}>
      {type === "error" ? "✕" : "✓"} {msg}
    </div>
  );
}

/* ─── Shared styles ─────────────────────────────────────────── */
const s = {
  page: { padding: "0 0 32px 0", fontFamily: "inherit" },
  tabs: {
    display: "flex", gap: 4, padding: "6px", marginBottom: 28,
    background: "rgba(255,255,255,0.04)", borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  tab: {
    display: "flex", alignItems: "center", gap: 8, padding: "9px 16px",
    borderRadius: 8, cursor: "pointer", border: "none", background: "transparent",
    color: "var(--muted)", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
    transition: "all 0.18s ease",
  },
  tabActive: { background: "var(--accent)", color: "#fff", boxShadow: "0 2px 12px rgba(124,58,237,0.4)" },
  banner: {
    borderRadius: 14, padding: "28px 32px", marginBottom: 24,
    background: "linear-gradient(135deg, #5b21b6 0%, #7c3aed 60%, #6d28d9 100%)",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "relative", overflow: "hidden",
  },
  bannerTitle: { fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 },
  bannerSub: { fontSize: 13.5, color: "rgba(255,255,255,0.8)", maxWidth: 480 },
  bannerBg: { position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", opacity: 0.12, fontSize: 80, lineHeight: 1, userSelect: "none", pointerEvents: "none" },
  card: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 },
  statCard: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 },
  statIconBox: { width: 36, height: 36, borderRadius: 8, background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statLabel: { fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase", marginBottom: 3 },
  statValue: { fontSize: 20, fontWeight: 800, color: "var(--fg)" },
  dropZone: { border: "2px dashed rgba(124,58,237,0.4)", borderRadius: 12, padding: "52px 24px", textAlign: "center", cursor: "pointer", background: "rgba(124,58,237,0.04)", transition: "all 0.2s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  dropZoneHover: { borderColor: "var(--accent)", background: "rgba(124,58,237,0.08)" },
  uploadBtn: { background: "transparent", border: "none", color: "var(--accent)", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", margin: 0, padding: 0 },
  repoEmpty: { background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)", borderRadius: 10, padding: "36px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  sectionLabel: { fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 14 },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "var(--fg)", fontSize: 13.5, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" },
  urlRow: { display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", gap: 16, padding: "12px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 8 },
  urlLabel: { fontSize: 13, color: "var(--fg)", fontWeight: 500 },
  sideCard: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px" },
  sideCardTitle: { fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 8, display: "flex", alignItems: "center", gap: 7 },
  identityMenu: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: 16 },
  identityMenuItem: { padding: "13px 18px", fontSize: 13.5, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "background 0.15s", border: "none", width: "100%", textAlign: "left", fontFamily: "inherit" },
  previewCard: { background: "linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)", borderRadius: 12, padding: "20px", textAlign: "center" },
  previewAvatar: { width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 },
  previewName: { fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 },
  previewSub: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 10 },
  previewChip: { display: "inline-block", background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "3px 12px", fontSize: 11, color: "rgba(255,255,255,0.85)", marginBottom: 14 },
  previewBubble: { background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 14px", fontSize: 12, color: "rgba(255,255,255,0.9)", textAlign: "left", lineHeight: 1.5 },

  btnPrimary: { background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7, transition: "opacity 0.2s" },
  btnSave: { background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: 8, padding: "10px 22px", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 7 },
  btnNext: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 20px", color: "var(--fg)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 },
};

/* ─── TABS CONFIG ───────────────────────────────────────────── */
const TABS = [
  { id: "overview", label: "Overview", icon: OverviewIcon },
  { id: "knowledge", label: "Knowledge Base", icon: KBIcon },
  { id: "websites", label: "Websites", icon: WebIcon },
  { id: "links", label: "Links", icon: LinkIcon },
];

/* ─── OVERVIEW TAB ──────────────────────────────────────────── */
const overviewSections = ["AI Identity", "Company Profile", "Contact Details"];

function OverviewTab({ agent, onSave }) {
  const [section, setSection] = useState("AI Identity");
  const [form, setForm] = useState({
    assistantName: agent?.assistant_name || "",
    tagline: agent?.tagline || "",
    companyName: agent?.company_name || "",
    website: agent?.website || "",
    contactEmail: agent?.contact_email || "",
    contactPhone: agent?.contact_phone || "",
  });
  const [saving, setSaving] = useState(false);

  // Sync when agent loads from parent
  useEffect(() => {
    if (agent) {
      setForm({
        assistantName: agent.assistant_name || "",
        tagline: agent.tagline || "",
        companyName: agent.company_name || "",
        website: agent.website || "",
        contactEmail: agent.contact_email || "",
        contactPhone: agent.contact_phone || "",
      });
    }
  }, [agent]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      assistantName: form.assistantName,
      tagline: form.tagline,
      companyName: form.companyName,
      website: form.website,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
    });
    setSaving(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20 }}>
      {/* Left col */}
      <div>
        <div style={s.identityMenu}>
          {overviewSections.map(sec => (
            <button key={sec}
              style={{ ...s.identityMenuItem, background: section === sec ? "rgba(124,58,237,0.25)" : "transparent", color: section === sec ? "var(--accent)" : "var(--fg)", borderBottom: "1px solid var(--border)" }}
              onClick={() => setSection(sec)}
            >
              {sec === "AI Identity" && <span>🤖</span>}
              {sec === "Company Profile" && <span>🏢</span>}
              {sec === "Contact Details" && <span>📞</span>}
              {sec}
            </button>
          ))}
        </div>

        {/* Live Identity Preview */}
        <div style={s.previewCard}>
          <div style={{ fontSize: 10, letterSpacing: 1, color: "rgba(255,255,255,0.6)", marginBottom: 12, fontWeight: 700 }}>✦ LIVE IDENTITY PREVIEW</div>
          <div style={s.previewAvatar}>🤖</div>
          <div style={s.previewName}>{form.assistantName || "Your Assistant"}</div>
          <div style={s.previewSub}>{form.companyName || "Your Company"}</div>
          <div style={s.previewChip}>{form.tagline || "information education"}</div>
          <div style={s.previewBubble}>
            Hello! I'm {form.assistantName || "your AI assistant"}. How can I help you learn more about us today?
          </div>
        </div>
      </div>

      {/* Right col */}
      <div style={s.card}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>{section}</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
          {section === "AI Identity" && "Configure your AI's personality and core identity."}
          {section === "Company Profile" && "Tell the AI about your company and what you do."}
          {section === "Contact Details" && "Set contact info the AI can share with visitors."}
        </div>

        {section === "AI Identity" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>
                Assistant Name <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input style={s.input} value={form.assistantName} onChange={e => update("assistantName", e.target.value)} placeholder="e.g. Orion Assistant" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Tagline</label>
              <input style={s.input} value={form.tagline} onChange={e => update("tagline", e.target.value)} placeholder="e.g. information education" />
            </div>
          </div>
        )}
        {section === "Company Profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Company Name <span style={{ color: "var(--accent)" }}>*</span></label>
              <input style={s.input} value={form.companyName} onChange={e => update("companyName", e.target.value)} placeholder="e.g. Orion Inc." />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Website</label>
              <input style={s.input} value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://yourcompany.com" />
            </div>
          </div>
        )}
        {section === "Contact Details" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Email</label>
              <input style={s.input} type="email" value={form.contactEmail} onChange={e => update("contactEmail", e.target.value)} placeholder="support@company.com" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Phone</label>
              <input style={s.input} value={form.contactPhone} onChange={e => update("contactPhone", e.target.value)} placeholder="+1 (555) 000-0000" />
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
          <button style={{ ...s.btnSave, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "✓ Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── KNOWLEDGE BASE TAB ────────────────────────────────────── */
function KnowledgeBaseTab({ agent, onToast }) {
  const [dragging, setDragging] = useState(false);
  const [docs, setDocs] = useState(agent?.documents || []);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  // Sync docs when agent loads
  useEffect(() => {
    if (agent?.documents) setDocs(agent.documents);
  }, [agent]);

  const handleFiles = async (files) => {
    if (!agent?.id) { onToast("Agent not loaded yet", "error"); return; }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const doc = await uploadAgentDocument(agent.id, file, "knowledge");
        setDocs(d => [doc, ...d]);
      }
      onToast("Document uploaded successfully", "success");
    } catch (err) {
      onToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!agent?.id) return;
    try {
      await deleteAgentDocument(agent.id, docId);
      setDocs(d => d.filter(x => x.id !== docId));
      onToast("Document removed", "success");
    } catch (err) {
      onToast(err.message || "Delete failed", "error");
    }
  };

  const totalKB = docs.reduce((acc, d) => acc + (d.file_size_bytes || 0) / 1024, 0);

  return (
    <div>
      <div style={s.banner}>
        <div>
          <div style={s.bannerTitle}><KBIcon /> Knowledge Base</div>
          <div style={s.bannerSub}>Upload documents to train your AI. It will read and understand these files to answer customer questions accurately.</div>
        </div>
        <div style={s.bannerBg}>📄</div>
      </div>

      <div style={s.grid3}>
        {[
          { label: "Total Knowledge", value: totalKB > 0 ? (totalKB / 1024).toFixed(2) + " MB" : "0.00 MB", icon: "💾" },
          { label: "Documents Processed", value: docs.length, icon: "📄" },
          { label: "Training Health", value: "100%", badge: "Optimal", icon: "📈" },
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={s.statIconBox}><span style={{ fontSize: 18 }}>{stat.icon}</span></div>
            <div>
              <div style={s.statLabel}>{stat.label}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={s.statValue}>{stat.value}</div>
                {stat.badge && <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(74,222,128,0.15)", color: "#4ade80", borderRadius: 20, padding: "2px 8px" }}>{stat.badge}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{ ...s.dropZone, ...(dragging ? s.dropZoneHover : {}), opacity: uploading ? 0.6 : 1 }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => !uploading && fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx" style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
        <div style={{ color: "var(--accent)" }}><UploadIcon /></div>
        <div>
          <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>
            {uploading ? "Uploading…" : "Click or drag files to upload"}
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Supports PDF, DOC, TXT, CSV, XLS (Max 50MB)</div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={s.sectionLabel}>Knowledge Repository ({docs.length})</div>
        {docs.length === 0 ? (
          <div style={s.repoEmpty}>
            <EmptyDocIcon />
            <div style={{ fontSize: 13.5, color: "var(--muted)" }}>No documents uploaded yet.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {docs.map(doc => (
              <div key={doc.id} style={{ ...s.card, display: "flex", alignItems: "center", gap: 14, padding: "13px 18px" }}>
                <div style={{ color: "var(--accent)" }}><DocIcon /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg)" }}>{doc.original_name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
                    {doc.file_size_bytes ? (doc.file_size_bytes / 1024).toFixed(1) + " KB" : ""} · Uploaded {new Date(doc.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(74,222,128,0.12)", color: "#4ade80", borderRadius: 20, padding: "2px 10px" }}>Processed</span>
                <button onClick={() => handleDelete(doc.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 16, lineHeight: 1 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── WEBSITES TAB ──────────────────────────────────────────── */
const defaultUrlLabels = ["A sales meeting transcript", "Your company FAQ", "A podcast transcript", "Your Blog", "A news article about you"];

function WebsitesTab({ agent, onSave, onToast }) {
  const [urls, setUrls] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (agent?.websites_json && Array.isArray(agent.websites_json) && agent.websites_json.length > 0) {
      setUrls(agent.websites_json);
    } else {
      setUrls(defaultUrlLabels.map(label => ({ id: Math.random().toString(36).slice(2), label, value: "" })));
    }
  }, [agent]);

  const addUrl = () => setUrls(u => [...u, { id: Math.random().toString(36).slice(2), label: "A new URL", value: "" }]);
  const updateUrl = (id, val) => setUrls(u => u.map(x => x.id === id ? { ...x, value: val } : x));

  const handleSave = async () => {
    setSaving(true);
    await onSave({ websitesJson: urls });
    setSaving(false);
  };

  return (
    <div>
      <div style={s.banner}>
        <div>
          <div style={s.bannerTitle}><WebIcon /> Website Training</div>
          <div style={s.bannerSub}>Add links your AI should learn from. We'll extract text and update its knowledge automatically.</div>
        </div>
        <div style={s.bannerBg}>🌐</div>
      </div>

      <div style={s.grid2}>
        <div>
          {urls.map(row => (
            <div key={row.id} style={s.urlRow}>
              <div style={s.urlLabel}>{row.label}</div>
              <input style={s.input} value={row.value} onChange={e => updateUrl(row.id, e.target.value)} placeholder="https://example.com" />
            </div>
          ))}
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button style={s.btnPrimary} onClick={addUrl}><PlusIcon /> Add Another URL</button>
            <button style={{ ...s.btnSave, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "✓ Save URLs"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={s.sideCard}>
            <div style={s.sideCardTitle}>🔗 Knowledge Network</div>
            <div style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 10, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(124,58,237,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PlusIcon />
              </div>
            </div>
          </div>
          <div style={s.sideCard}>
            <div style={s.sideCardTitle}>💡 What to Add?</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>Our system extracts text from these links to your AI. Best results come from:</div>
            <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 12.5, color: "var(--muted)", lineHeight: 2 }}>
              <li>Product or Service pages</li>
              <li>FAQ or Help Center articles</li>
              <li>Blog posts about your business</li>
              <li>News articles or press releases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LINKS TAB ─────────────────────────────────────────────── */
function LinksTab({ agent, onSave, onToast }) {
  const [dragging, setDragging] = useState(false);
  const [uploaded, setUploaded] = useState(agent?.links_csv_path ? agent.links_csv_path.split("/").pop() : null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (agent?.links_csv_path) {
      setUploaded(agent.links_csv_path.split("/").pop() || null);
    }
  }, [agent]);

  const handleFile = async (files) => {
    if (!agent?.id) { onToast("Agent not loaded yet", "error"); return; }
    const file = files[0];
    if (!file) return;
    setUploading(true);
    try {
      const doc = await uploadAgentDocument(agent.id, file, "links");
      setUploaded(file.name);
      await onSave({ linksCsvPath: doc.file_path });
      onToast("Links CSV uploaded", "success");
    } catch (err) {
      onToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div style={s.banner}>
        <div>
          <div style={s.bannerTitle}>🔗 Resource Links</div>
          <div style={s.bannerSub}>Upload a CSV of helpful links. Your AI will share these with visitors when they ask for specific resources.</div>
        </div>
        <div style={s.bannerBg}>🔗</div>
      </div>

      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#4ade80" }}>● Auto-saving changes</span>
        <span>Manage AI Assistant</span>
      </div>

      <div style={s.grid2}>
        <div
          style={{ ...s.dropZone, minHeight: 220, ...(dragging ? s.dropZoneHover : {}), opacity: uploading ? 0.6 : 1 }}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files); }}
          onClick={() => !uploading && fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => handleFile(e.target.files)} />
          <div style={{ color: "var(--accent)", marginBottom: 4 }}><UploadIcon /></div>
          {uploading ? (
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)" }}>Uploading…</div>
          ) : uploaded ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)" }}>✓ {uploaded}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Click to replace</div>
            </>
          ) : (
            <>
              <button style={s.uploadBtn}>Upload Resource CSV</button>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Drag and drop to select</div>
            </>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={s.sideCard}>
            <div style={s.sideCardTitle}>
              <span style={{ width: 14, height: 14, background: "rgba(124,58,237,0.3)", borderRadius: 3, display: "inline-block" }} />
              Citation Preview
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "12px 12px 4px 12px", padding: "9px 13px", fontSize: 12.5, color: "var(--fg)", maxWidth: "85%" }}>
                  Do you have a price list I can see?
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>👤</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🤖</div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px 12px 12px 12px", padding: "9px 13px", fontSize: 12.5, color: "var(--fg)", maxWidth: "85%" }}>
                  Yes, here is the pricing information you requested:
                  <div style={{ marginTop: 8, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "7px 11px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <DocIcon />
                      <div>
                        <div style={{ fontSize: 11.5, fontWeight: 600 }}>Pricing Sheet 2024</div>
                        <div style={{ fontSize: 10, color: "var(--muted)" }}>Source: resources.csv</div>
                      </div>
                    </div>
                    <span style={{ cursor: "pointer", color: "var(--accent)", fontSize: 12 }}>↗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ ...s.sideCard, background: "linear-gradient(135deg,#4c1d95,#5b21b6)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Need a template?</div>
            <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", marginBottom: 14, lineHeight: 1.6 }}>
              Download our sample CSV file to ensure your links are formatted correctly for the AI to understand.
            </div>
            <button style={{ ...s.btnPrimary, width: "100%", justifyContent: "center", background: "rgba(255,255,255,0.15)" }}>
              <DownloadIcon /> Download Sample CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ─── MAIN PAGE ─────────────────────────────────────────────── */
export default function AgentsPage() {
  const { tab = "overview" } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = tab;
  const { businessId } = useBusiness();
  const searchQuery = searchParams.get("q") || "";
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3500);
  }, []);

  // Load agent on mount / when businessId changes
  useEffect(() => {
    if (!businessId) { setLoading(false); return; }
    setLoading(true);
    getAgent(businessId)
      .then(a => { setAgent(a); setLoading(false); })
      .catch(err => { console.error(err); showToast("Failed to load agent config", "error"); setLoading(false); });
  }, [businessId, showToast]);

  // Generic save handler — calls updateAgent and merges result back
  const handleSave = useCallback(async (fields) => {
    if (!agent?.id) { showToast("Agent not initialised yet", "error"); return; }
    try {
      const updated = await updateAgent(agent.id, fields);
      setAgent(prev => ({ ...prev, ...updated }));
      showToast("Changes saved successfully", "success");
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    }
  }, [agent, showToast]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, gap: 16, color: "var(--muted)", fontSize: 14 }}>
        <div style={{ width: 20, height: 20, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        Loading agent configuration…
      </div>
    );
  }

  if (!businessId) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, flexDirection: "column", gap: 12, color: "var(--muted)" }}>
        <div style={{ fontSize: 36 }}>🏢</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>No business connected</div>
        <div style={{ fontSize: 12 }}>Start the backend and make sure a business exists.</div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab agent={agent} onSave={handleSave} />}
      {activeTab === "knowledge" && <KnowledgeBaseTab agent={agent} onToast={showToast} />}
      {activeTab === "websites" && <WebsitesTab agent={agent} onSave={handleSave} onToast={showToast} />}
      {activeTab === "links" && <LinksTab agent={agent} onSave={handleSave} onToast={showToast} />}

      <Toast msg={toast.msg} type={toast.type} />
    </div>
  );
}