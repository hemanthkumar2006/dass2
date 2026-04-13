import { useState, useEffect, useCallback } from "react";
import {
  getVoiceConfigRaw,
  updateVoiceConfig,
  makeVoiceCall,
  makeBulkVoiceCalls,
  getVoiceLogs,
  getVoiceStats,
  getVoiceBookings,
  getVoiceContacts,
} from "../api/client";

/* ── Sub-navigation tabs ── */
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "outbound", label: "Outbound Calls", icon: "📲" },
  { id: "logs", label: "Call Logs", icon: "📞" },
  { id: "contacts", label: "CRM Contacts", icon: "👥" },
  { id: "calendar", label: "Calendar", icon: "📅" },
  { id: "agent", label: "Agent Settings", icon: "🤖" },
  { id: "models", label: "Models & Voice", icon: "🎙️" },
  { id: "languages", label: "Languages", icon: "🌐" },
  { id: "credentials", label: "API Credentials", icon: "🔑" },
];

/* ── Language Presets ── */
const LANG_PRESETS = {
  hinglish:    { flag:"🇮🇳", label:"Hinglish",           sub:"Hindi + English mix",     color:"#6c63ff" },
  hindi:       { flag:"🇮🇳", label:"Hindi",              sub:"Pure Hindi",               color:"#a855f7" },
  english:     { flag:"🇬🇧", label:"English (India)",    sub:"Indian English",           color:"#3b82f6" },
  tamil:       { flag:"🇮🇳", label:"Tamil",              sub:"தமிழ்",                    color:"#f59e0b" },
  telugu:      { flag:"🇮🇳", label:"Telugu",             sub:"తెలుగు",                   color:"#10b981" },
  gujarati:    { flag:"🇮🇳", label:"Gujarati",           sub:"ગુજરાતી",                  color:"#ef4444" },
  bengali:     { flag:"🇮🇳", label:"Bengali",            sub:"বাংলা",                    color:"#f97316" },
  marathi:     { flag:"🇮🇳", label:"Marathi",            sub:"मराठी",                    color:"#14b8a6" },
  kannada:     { flag:"🇮🇳", label:"Kannada",            sub:"ಕನ್ನಡ",                    color:"#8b5cf6" },
  malayalam:   { flag:"🇮🇳", label:"Malayalam",          sub:"മലയാളം",                   color:"#ec4899" },
  multilingual:{ flag:"🌍", label:"Multilingual (Auto)", sub:"Detects caller's language", color:"#22c55e" },
};

const LANG_VOICES = { hinglish:"kavya", hindi:"ritu", english:"dev", tamil:"priya", telugu:"kavya", gujarati:"rohan", bengali:"neha", marathi:"shubh", kannada:"rahul", malayalam:"ritu", multilingual:"kavya" };
const LANG_CODES = { hinglish:"hi-IN", hindi:"hi-IN", english:"en-IN", tamil:"ta-IN", telugu:"te-IN", gujarati:"gu-IN", bengali:"bn-IN", marathi:"mr-IN", kannada:"kn-IN", malayalam:"ml-IN", multilingual:"hi-IN" };

/* ── Styles ── */
const s = {
  page: { minHeight: "100%" },
  tabBar: {
    display: "flex", gap: 4, padding: "4px 0 16px", overflowX: "auto",
    borderBottom: "1px solid var(--border)", marginBottom: 20,
  },
  tab: (active) => ({
    padding: "8px 16px", borderRadius: 10, border: "1px solid transparent",
    background: active ? "var(--accentL)" : "transparent",
    borderColor: active ? "var(--accentB)" : "transparent",
    color: active ? "#a78bfa" : "var(--muted)",
    fontWeight: active ? 700 : 500, fontSize: 13, cursor: "pointer",
    fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.15s",
    display: "flex", alignItems: "center", gap: 6,
  }),
  sectionCard: {
    background: "var(--panel)", border: "1px solid var(--border)",
    borderRadius: 14, padding: 24, marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14, fontWeight: 700, marginBottom: 16,
    paddingBottom: 12, borderBottom: "1px solid var(--border)",
  },
  formGroup: { marginBottom: 18 },
  label: {
    display: "block", fontSize: 11, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: 0.6, color: "var(--muted)", marginBottom: 6,
  },
  input: {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "10px 12px", color: "var(--text)",
    fontFamily: "inherit", fontSize: 13.5, outline: "none",
    transition: "border-color 0.15s", boxSizing: "border-box",
  },
  textarea: {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "10px 12px", color: "var(--text)",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: 13,
    outline: "none", resize: "vertical", boxSizing: "border-box",
  },
  select: {
    width: "100%", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 8, padding: "10px 12px", color: "var(--text)",
    fontFamily: "inherit", fontSize: 13.5, outline: "none", boxSizing: "border-box",
  },
  hint: { fontSize: 11.5, color: "var(--muted)", marginTop: 5 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 },
  statCard: {
    background: "var(--panel)", border: "1px solid var(--border)",
    borderRadius: 12, padding: 20, transition: "transform 0.15s, box-shadow 0.15s",
  },
  statLabel: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" },
  statValue: { fontSize: 28, fontWeight: 800, marginTop: 8, letterSpacing: -1 },
  statSub: { fontSize: 12, color: "var(--muted)", marginTop: 4 },
  badge: (type) => ({
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
    background: type === "green" ? "rgba(34,197,94,0.12)" : type === "yellow" ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.07)",
    color: type === "green" ? "#22c55e" : type === "yellow" ? "#f59e0b" : "var(--muted)",
  }),
  tableWrap: {
    background: "var(--panel)", border: "1px solid var(--border)",
    borderRadius: 12, overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600,
    color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em",
    background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--border)",
  },
  td: { padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "middle" },
  btnPrimary: {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px",
    borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
    border: "none", background: "linear-gradient(135deg, var(--accent), var(--accent2))",
    color: "#fff", boxShadow: "0 2px 12px rgba(124,58,237,0.3)", fontFamily: "inherit",
    transition: "all 0.15s",
  },
  btnGhost: {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px",
    borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
    border: "1px solid var(--border)", background: "transparent",
    color: "var(--muted)", fontFamily: "inherit", transition: "all 0.15s",
  },
  toast: (visible) => ({
    position: "fixed", bottom: 24, right: 24, background: "#22c55e", color: "#fff",
    padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600,
    zIndex: 9999, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: "all 0.3s ease", pointerEvents: "none",
  }),
};

function badgeFor(summary) {
  if (!summary) return <span style={s.badge("gray")}>Completed</span>;
  if (summary.toLowerCase().includes("confirm")) return <span style={s.badge("green")}>✓ Booked</span>;
  if (summary.toLowerCase().includes("cancel")) return <span style={s.badge("yellow")}>✗ Cancelled</span>;
  return <span style={s.badge("gray")}>Completed</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function VoiceCallsPage() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState("");

  // Dashboard state
  const [stats, setStats] = useState({ total_calls: 0, total_bookings: 0, avg_duration: 0, booking_rate: 0 });
  const [recentLogs, setRecentLogs] = useState([]);
  const [dashLoading, setDashLoading] = useState(true);

  // Outbound
  const [singlePhone, setSinglePhone] = useState("");
  const [singleStatus, setSingleStatus] = useState(null);
  const [bulkNums, setBulkNums] = useState("");
  const [bulkStatus, setBulkStatus] = useState(null);
  const [bulkResults, setBulkResults] = useState([]);

  // Logs
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Contacts
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);

  // Calendar
  const [bookings, setBookings] = useState([]);
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // Config
  const [config, setConfig] = useState({});
  const [configLoading, setConfigLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({});

  // Language
  const [currentLang, setCurrentLang] = useState("multilingual");

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  /* ── Load data based on active tab ── */
  useEffect(() => {
    if (tab === "dashboard") loadDashboard();
    if (tab === "logs") loadLogs();
    if (tab === "contacts") loadContacts();
    if (tab === "calendar") loadBookings();
    if (["agent", "models", "credentials", "languages"].includes(tab)) loadConfig();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadDashboard() {
    setDashLoading(true);
    try {
      const [s, l] = await Promise.all([getVoiceStats(), getVoiceLogs()]);
      setStats(s);
      setRecentLogs(l.slice(0, 10));
    } catch (e) { console.error(e); }
    setDashLoading(false);
  }

  async function loadLogs() {
    setLogsLoading(true);
    try { setLogs(await getVoiceLogs()); } catch (e) { console.error(e); }
    setLogsLoading(false);
  }

  async function loadContacts() {
    setContactsLoading(true);
    try { setContacts(await getVoiceContacts()); } catch (e) { console.error(e); }
    setContactsLoading(false);
  }

  async function loadBookings() {
    try { setBookings(await getVoiceBookings()); } catch (e) { console.error(e); }
  }

  async function loadConfig() {
    setConfigLoading(true);
    try {
      const c = await getVoiceConfigRaw();
      setConfig(c);
      setCurrentLang(c.lang_preset || "multilingual");
    } catch (e) { console.error(e); }
    setConfigLoading(false);
  }

  async function saveSection(section, data) {
    try {
      await updateVoiceConfig(data);
      setSaveStatus(s => ({ ...s, [section]: true }));
      showToast(`✅ ${section.charAt(0).toUpperCase() + section.slice(1)} settings saved!`);
      setTimeout(() => setSaveStatus(s => ({ ...s, [section]: false })), 2500);
    } catch (e) {
      alert("Failed to save: " + e.message);
    }
  }

  /* ── single call ── */
  async function handleSingleCall() {
    if (!singlePhone.trim()) return;
    setSingleStatus({ type: "loading", text: "⏳ Dispatching..." });
    try {
      const res = await makeVoiceCall(singlePhone.trim());
      if (res.status === "ok") {
        setSingleStatus({ type: "success", text: `✅ Call dispatched! Dispatch ID: ${res.dispatch_id}` });
      } else {
        setSingleStatus({ type: "error", text: `❌ ${res.message}` });
      }
    } catch (e) {
      setSingleStatus({ type: "error", text: `❌ ${e.message}` });
    }
  }

  /* ── bulk call ── */
  async function handleBulkCall() {
    if (!bulkNums.trim()) return;
    setBulkStatus({ type: "loading", text: "⏳ Dispatching all numbers..." });
    try {
      const res = await makeBulkVoiceCalls(bulkNums.trim());
      const results = res.results || [];
      setBulkResults(results);
      const okCount = results.filter(r => r.status === "ok").length;
      setBulkStatus({ type: "success", text: `✅ ${okCount}/${results.length} calls dispatched` });
    } catch (e) {
      setBulkStatus({ type: "error", text: `❌ ${e.message}` });
    }
  }

  /* ── language preset ── */
  async function selectLang(id) {
    setCurrentLang(id);
    try {
      await updateVoiceConfig({
        lang_preset: id,
        tts_language: LANG_CODES[id],
        tts_voice: LANG_VOICES[id],
      });
      showToast(`✅ ${LANG_PRESETS[id].label} preset activated!`);
    } catch (e) {
      alert("Failed to save: " + e.message);
    }
  }

  /* ── Calendar helpers ── */
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  function buildCalendar() {
    const bookMap = {};
    bookings.forEach(b => {
      const d = b.created_at ? b.created_at.slice(0, 10) : null;
      if (d) { bookMap[d] = bookMap[d] || []; bookMap[d].push(b); }
    });

    const first = new Date(calYear, calMonth, 1);
    const last = new Date(calYear, calMonth + 1, 0);
    const startPad = first.getDay();
    const today = new Date();
    const cells = [];

    // Prev month padding
    for (let i = 0; i < startPad; i++) {
      const d = new Date(calYear, calMonth, -startPad + i + 1);
      cells.push({ day: d.getDate(), other: true, dateStr: null, bks: [] });
    }

    for (let day = 1; day <= last.getDate(); day++) {
      const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const bks = bookMap[dateStr] || [];
      const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === day;
      cells.push({ day, other: false, dateStr, bks, isToday });
    }

    // Next month padding
    const endPad = 6 - last.getDay();
    for (let i = 1; i <= endPad; i++) {
      cells.push({ day: i, other: true, dateStr: null, bks: [] });
    }

    return cells;
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════════════════════════ */

  return (
    <div style={s.page}>
      {/* Toast */}
      <div style={s.toast(!!toast)}>{toast}</div>

      {/* Tab Bar */}
      <div style={s.tabBar}>
        {TABS.map(t => (
          <button key={t.id} style={s.tab(tab === t.id)} onClick={() => setTab(t.id)}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* ══════════════ DASHBOARD TAB ══════════════ */}
      {tab === "dashboard" && (
        <div>
          <div style={s.statGrid}>
            <div style={s.statCard}>
              <div style={s.statLabel}>Total Calls</div>
              <div style={s.statValue}>{dashLoading ? "—" : stats.total_calls}</div>
              <div style={s.statSub}>All time</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statLabel}>Bookings Made</div>
              <div style={s.statValue}>{dashLoading ? "—" : stats.total_bookings}</div>
              <div style={s.statSub}>Confirmed appointments</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statLabel}>Avg Duration</div>
              <div style={s.statValue}>{dashLoading ? "—" : `${stats.avg_duration}s`}</div>
              <div style={s.statSub}>Seconds per call</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statLabel}>Booking Rate</div>
              <div style={s.statValue}>{dashLoading ? "—" : `${stats.booking_rate}%`}</div>
              <div style={s.statSub}>Calls that converted</div>
            </div>
          </div>

          <div style={s.sectionCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ ...s.sectionTitle, border: "none", padding: 0, margin: 0 }}>Recent Calls</div>
              <button style={s.btnGhost} onClick={loadDashboard}>↻ Refresh</button>
            </div>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Date</th>
                    <th style={s.th}>Phone</th>
                    <th style={s.th}>Duration</th>
                    <th style={s.th}>Status</th>
                    <th style={s.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashLoading ? (
                    <tr><td colSpan={5} style={{ ...s.td, textAlign: "center", padding: 24, color: "var(--muted)" }}>Loading...</td></tr>
                  ) : recentLogs.length === 0 ? (
                    <tr><td colSpan={5} style={{ ...s.td, textAlign: "center", padding: 24, color: "var(--muted)" }}>No calls yet. Make a test call!</td></tr>
                  ) : recentLogs.map((log, i) => (
                    <tr key={i}>
                      <td style={{ ...s.td, color: "var(--muted)" }}>{log.created_at ? new Date(log.created_at).toLocaleString() : "—"}</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>{log.phone_number || "Unknown"}</td>
                      <td style={s.td}>{log.duration_seconds || 0}s</td>
                      <td style={s.td}>{badgeFor(log.summary)}</td>
                      <td style={s.td}>
                        {log.id && (
                          <a href={`/api/voice/logs/${log.id}/transcript`} download style={{ color: "var(--accent)", fontSize: 12, textDecoration: "none" }}>
                            ⬇ Transcript
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ OUTBOUND CALLS TAB ══════════════ */}
      {tab === "outbound" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
            {/* Single Call */}
            <div style={s.sectionCard}>
              <div style={s.sectionTitle}>Single Call</div>
              <div style={s.formGroup}>
                <label style={s.label}>Phone Number (with country code)</label>
                <input
                  style={{ ...s.input, fontFamily: "monospace" }}
                  placeholder="+91XXXXXXXXXX"
                  value={singlePhone}
                  onChange={e => setSinglePhone(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSingleCall()}
                />
                <div style={s.hint}>Must start with + and country code e.g. +91</div>
              </div>
              <button style={{ ...s.btnPrimary, width: "100%" }} onClick={handleSingleCall}>📞 Call Now</button>
              {singleStatus && (
                <div style={{ marginTop: 12, fontSize: 13, color: singleStatus.type === "success" ? "var(--good)" : singleStatus.type === "error" ? "var(--bad)" : "var(--muted)" }}>
                  {singleStatus.text}
                </div>
              )}
            </div>

            {/* Bulk Call */}
            <div style={s.sectionCard}>
              <div style={s.sectionTitle}>Bulk Call</div>
              <div style={s.formGroup}>
                <label style={s.label}>Phone Numbers (one per line)</label>
                <textarea
                  style={{ ...s.textarea, minHeight: 140 }}
                  placeholder={"+91XXXXXXXXXX\n+91YYYYYYYYYY\n+44ZZZZZZZZZ"}
                  value={bulkNums}
                  onChange={e => setBulkNums(e.target.value)}
                  rows={6}
                />
                <div style={s.hint}>Each line is a separate call dispatched simultaneously</div>
              </div>
              <button style={{ ...s.btnPrimary, width: "100%" }} onClick={handleBulkCall}>🚀 Call All Numbers</button>
              {bulkStatus && (
                <div style={{ marginTop: 12, fontSize: 13, color: bulkStatus.type === "success" ? "var(--good)" : bulkStatus.type === "error" ? "var(--bad)" : "var(--muted)" }}>
                  {bulkStatus.text}
                </div>
              )}
            </div>
          </div>

          {/* Bulk results */}
          {bulkResults.length > 0 && (
            <div style={s.sectionCard}>
              <div style={s.sectionTitle}>Call Results</div>
              {bulkResults.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "monospace" }}>{r.phone}</span>
                  <span style={s.badge(r.status === "ok" ? "green" : "gray")}>
                    {r.status === "ok" ? "✅ Sent" : `❌ ${r.message}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════ CALL LOGS TAB ══════════════ */}
      {tab === "logs" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Call Logs</h3>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Full history of all calls and transcripts</div>
            </div>
            <button style={s.btnGhost} onClick={loadLogs}>↻ Refresh</button>
          </div>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Date & Time</th>
                  <th style={s.th}>Phone</th>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Duration</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Summary</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logsLoading ? (
                  <tr><td colSpan={7} style={{ ...s.td, textAlign: "center", padding: 32, color: "var(--muted)" }}>Loading...</td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={7} style={{ ...s.td, textAlign: "center", padding: 32, color: "var(--muted)" }}>No call logs found.</td></tr>
                ) : logs.map((log, i) => (
                  <tr key={i} style={{ transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ ...s.td, color: "var(--muted)", whiteSpace: "nowrap" }}>{log.created_at ? new Date(log.created_at).toLocaleString() : "—"}</td>
                    <td style={{ ...s.td, fontWeight: 600 }}>{log.phone_number || "Unknown"}</td>
                    <td style={s.td}>{log.caller_name || <span style={{ color: "var(--muted)" }}>—</span>}</td>
                    <td style={s.td}>{log.duration_seconds || 0}s</td>
                    <td style={s.td}>{badgeFor(log.summary)}</td>
                    <td style={{ ...s.td, color: "var(--muted)", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={log.summary || ""}>
                      {log.summary || "—"}
                    </td>
                    <td style={s.td}>
                      {log.id && (
                        <a href={`/api/voice/logs/${log.id}/transcript`} download style={{ ...s.btnGhost, textDecoration: "none", fontSize: 11, padding: "4px 10px" }}>
                          ⬇ Transcript
                        </a>
                      )}
                      {log.recording_url && (
                        <a href={log.recording_url} target="_blank" rel="noreferrer" style={{ ...s.btnGhost, textDecoration: "none", fontSize: 11, padding: "4px 10px", marginLeft: 4 }}>
                          🎧 Recording
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ CRM CONTACTS TAB ══════════════ */}
      {tab === "contacts" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>CRM Contacts</h3>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Every caller recorded automatically — name, phone, call history</div>
            </div>
            <button style={s.btnGhost} onClick={loadContacts}>↻ Refresh</button>
          </div>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Phone</th>
                  <th style={s.th}>Total Calls</th>
                  <th style={s.th}>Last Seen</th>
                  <th style={s.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {contactsLoading ? (
                  <tr><td colSpan={5} style={{ ...s.td, textAlign: "center", padding: 32, color: "var(--muted)" }}>Loading contacts...</td></tr>
                ) : contacts.length === 0 ? (
                  <tr><td colSpan={5} style={{ ...s.td, textAlign: "center", padding: 40, color: "var(--muted)" }}>No contacts yet. They will appear here automatically after calls.</td></tr>
                ) : contacts.map((c, i) => (
                  <tr key={i} style={{ transition: "background 0.12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ ...s.td, fontWeight: 600 }}>{c.caller_name || <span style={{ color: "var(--muted)", fontWeight: 400 }}>Unknown</span>}</td>
                    <td style={{ ...s.td, fontFamily: "monospace", fontSize: 13 }}>{c.phone_number || "—"}</td>
                    <td style={{ ...s.td, textAlign: "center" }}>
                      <span style={{ background: "rgba(124,58,237,0.12)", color: "var(--accent)", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{c.total_calls}</span>
                    </td>
                    <td style={{ ...s.td, color: "var(--muted)", fontSize: 12 }}>{c.last_seen ? new Date(c.last_seen).toLocaleString() : "—"}</td>
                    <td style={s.td}>
                      {c.is_booked ? <span style={s.badge("green")}>✅ Booked</span> : <span style={s.badge("gray")}>📵 No booking</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ CALENDAR TAB ══════════════ */}
      {tab === "calendar" && (
        <div>
          <div style={s.sectionCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <button style={s.btnGhost} onClick={() => { const m = calMonth - 1; if (m < 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m); }}>← Prev</button>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{months[calMonth]} {calYear}</div>
              <button style={s.btnGhost} onClick={() => { const m = calMonth + 1; if (m > 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m); }}>Next →</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
              {dayNames.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", fontWeight: 600, padding: "8px 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d}</div>
              ))}
              {buildCalendar().map((cell, i) => (
                <div
                  key={i}
                  onClick={() => { if (!cell.other && cell.dateStr) { setSelectedDay(cell.dateStr); setSelectedBookings(cell.bks); } }}
                  style={{
                    minHeight: 80, background: "var(--panel)", border: `1px solid ${cell.isToday ? "var(--accent)" : "var(--border)"}`,
                    borderRadius: 10, padding: 10, cursor: cell.other ? "default" : "pointer",
                    transition: "all 0.18s", opacity: cell.other ? 0.3 : 1,
                    boxShadow: cell.isToday ? "0 0 0 2px rgba(124,58,237,0.18)" : "none",
                  }}
                  onMouseEnter={e => { if (!cell.other) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "scale(1.03)"; } }}
                  onMouseLeave={e => { if (!cell.other) { e.currentTarget.style.borderColor = cell.isToday ? "var(--accent)" : "var(--border)"; e.currentTarget.style.transform = "scale(1)"; } }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{cell.day}</div>
                  {cell.bks.length > 0 && (
                    <>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", marginTop: 6, boxShadow: "0 0 6px var(--accent)" }} />
                      <div style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600, marginTop: 3 }}>{cell.bks.length} booking{cell.bks.length > 1 ? "s" : ""}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selected Day Detail */}
          {selectedDay && (
            <div style={s.sectionCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Bookings on {selectedDay}</h3>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{selectedBookings.length} booking{selectedBookings.length !== 1 ? "s" : ""}</div>
                </div>
                <button style={s.btnGhost} onClick={() => setSelectedDay(null)}>✕ Close</button>
              </div>
              {selectedBookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: 32, color: "var(--muted)" }}>📅 No bookings on this day.</div>
              ) : selectedBookings.map((b, i) => (
                <div key={i} style={{ padding: 14, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 10, transition: "border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>📞 {b.phone_number || "Unknown"}</div>
                    <span style={s.badge("green")}>✅ Booked</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>🕐 {b.created_at ? new Date(b.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                  {b.summary && (
                    <div style={{ fontSize: 12, color: "var(--text)", marginTop: 6, padding: 8, background: "rgba(255,255,255,0.04)", borderRadius: 6 }}>💬 {b.summary}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════ AGENT SETTINGS TAB ══════════════ */}
      {tab === "agent" && (
        <div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>Opening Greeting</div>
            <div style={s.formGroup}>
              <label style={s.label}>First Line (What the agent says when a call connects)</label>
              <input
                style={s.input}
                placeholder="Hello! This is your AI assistant..."
                value={config.first_line || ""}
                onChange={e => setConfig({ ...config, first_line: e.target.value })}
              />
              <div style={s.hint}>This is the very first thing the agent says. Keep it concise and warm.</div>
            </div>
          </div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>System Prompt</div>
            <div style={s.formGroup}>
              <label style={s.label}>Master System Prompt</label>
              <textarea
                style={{ ...s.textarea, minHeight: 260 }}
                placeholder="Enter the AI's full personality and instructions..."
                value={config.agent_instructions || ""}
                onChange={e => setConfig({ ...config, agent_instructions: e.target.value })}
                rows={16}
              />
              <div style={s.hint}>Date and time context are injected automatically. Do not hardcode today's date.</div>
            </div>
          </div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>Listening Sensitivity</div>
            <div style={s.formGroup}>
              <label style={s.label}>Endpointing Delay (seconds)</label>
              <input
                style={{ ...s.input, maxWidth: 220 }}
                type="number"
                step="0.05"
                min="0.1"
                max="3.0"
                value={config.stt_min_endpointing_delay ?? 0.6}
                onChange={e => setConfig({ ...config, stt_min_endpointing_delay: parseFloat(e.target.value) })}
              />
              <div style={s.hint}>Seconds the AI waits after silence before responding. Default: 0.6</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 0" }}>
            <button style={s.btnPrimary} onClick={() => saveSection("agent", {
              first_line: config.first_line,
              agent_instructions: config.agent_instructions,
              stt_min_endpointing_delay: config.stt_min_endpointing_delay,
            })}>💾 Save Agent Settings</button>
          </div>
        </div>
      )}

      {/* ══════════════ MODELS & VOICE TAB ══════════════ */}
      {tab === "models" && (
        <div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>Language Model (LLM)</div>
            <div style={{ ...s.formGroup, maxWidth: 400 }}>
              <label style={s.label}>OpenAI Model</label>
              <select style={s.select} value={config.llm_model || "gpt-4o-mini"} onChange={e => setConfig({ ...config, llm_model: e.target.value })}>
                <option value="gpt-4o-mini">gpt-4o-mini — Fast & Cheap (Default)</option>
                <option value="gpt-4o">gpt-4o — Balanced</option>
                <option value="gpt-4.1">gpt-4.1 — Latest (Recommended)</option>
                <option value="gpt-4.1-mini">gpt-4.1-mini — Fast & Latest</option>
                <option value="gpt-4.5-preview">gpt-4.5-preview — Most Capable</option>
                <option value="o4-mini">o4-mini — Reasoning, Fast</option>
                <option value="o3">o3 — Reasoning, Best</option>
                <option value="gpt-4-turbo">gpt-4-turbo — Legacy</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo — Cheapest</option>
              </select>
            </div>
          </div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>Voice Synthesis (Sarvam bulbul:v3)</div>
            <div style={{ ...s.formRow, maxWidth: 720 }}>
              <div style={s.formGroup}>
                <label style={s.label}>Speaker Voice</label>
                <select style={s.select} value={config.tts_voice || "kavya"} onChange={e => setConfig({ ...config, tts_voice: e.target.value })}>
                  <option value="kavya">Kavya — Female, Friendly</option>
                  <option value="rohan">Rohan — Male, Balanced</option>
                  <option value="priya">Priya — Female, Warm</option>
                  <option value="shubh">Shubh — Male, Formal</option>
                  <option value="shreya">Shreya — Female, Clear</option>
                  <option value="ritu">Ritu — Female, Soft</option>
                  <option value="rahul">Rahul — Male, Deep</option>
                  <option value="amit">Amit — Male, Casual</option>
                  <option value="neha">Neha — Female, Energetic</option>
                  <option value="dev">Dev — Male, Professional</option>
                </select>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Language</label>
                <select style={s.select} value={config.tts_language || "hi-IN"} onChange={e => setConfig({ ...config, tts_language: e.target.value })}>
                  <option value="hi-IN">Hindi (hi-IN)</option>
                  <option value="en-IN">English India (en-IN)</option>
                  <option value="ta-IN">Tamil (ta-IN)</option>
                  <option value="te-IN">Telugu (te-IN)</option>
                  <option value="kn-IN">Kannada (kn-IN)</option>
                  <option value="ml-IN">Malayalam (ml-IN)</option>
                  <option value="mr-IN">Marathi (mr-IN)</option>
                  <option value="gu-IN">Gujarati (gu-IN)</option>
                  <option value="bn-IN">Bengali (bn-IN)</option>
                </select>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px 0" }}>
            <button style={s.btnPrimary} onClick={() => saveSection("models", {
              llm_model: config.llm_model,
              tts_voice: config.tts_voice,
              tts_language: config.tts_language,
            })}>💾 Save Model Settings</button>
          </div>
        </div>
      )}

      {/* ══════════════ LANGUAGES TAB ══════════════ */}
      {tab === "languages" && (
        <div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>Select a Language Mode</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {Object.entries(LANG_PRESETS).map(([id, p]) => (
                <div
                  key={id}
                  onClick={() => selectLang(id)}
                  style={{
                    background: id === currentLang ? "rgba(108,99,255,0.15)" : "var(--bg)",
                    border: `2px solid ${id === currentLang ? p.color : "var(--border)"}`,
                    borderRadius: 12, padding: 18, cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: id === currentLang ? "0 0 16px rgba(108,99,255,0.2)" : "none",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = p.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = id === currentLang ? p.color : "var(--border)"}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{p.flag}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: id === currentLang ? p.color : "var(--text)" }}>{p.label}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{p.sub}</div>
                  {id === currentLang && <div style={{ fontSize: 10, color: "#22c55e", marginTop: 6, fontWeight: 600 }}>✓ ACTIVE</div>}
                </div>
              ))}
            </div>
          </div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>About Multilingual Mode</div>
            <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
              In <strong style={{ color: "var(--text)" }}>Multilingual (Auto)</strong> mode the agent listens to the caller's first message and
              automatically replies in the same language for the rest of the call.
              Ideal for showcasing the agent across different audiences.<br /><br />
              Language changes take effect on the <strong style={{ color: "var(--accent)" }}>next incoming call</strong>.
              The TTS voice and language code are updated automatically.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════ API CREDENTIALS TAB ══════════════ */}
      {tab === "credentials" && (
        <div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>LiveKit</div>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>LiveKit URL</label>
                <input style={s.input} value={config.livekit_url || ""} onChange={e => setConfig({ ...config, livekit_url: e.target.value })} placeholder="wss://your-project.livekit.cloud" />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>SIP Trunk ID</label>
                <input style={s.input} value={config.sip_trunk_id || ""} onChange={e => setConfig({ ...config, sip_trunk_id: e.target.value })} placeholder="ST_xxxxxxxxx" />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>API Key</label>
                <input style={s.input} type="password" value={config.livekit_api_key || ""} onChange={e => setConfig({ ...config, livekit_api_key: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>API Secret</label>
                <input style={s.input} type="password" value={config.livekit_api_secret || ""} onChange={e => setConfig({ ...config, livekit_api_secret: e.target.value })} />
              </div>
            </div>
          </div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>AI Providers</div>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>OpenAI API Key</label>
                <input style={s.input} type="password" value={config.openai_api_key || ""} onChange={e => setConfig({ ...config, openai_api_key: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Sarvam API Key</label>
                <input style={s.input} type="password" value={config.sarvam_api_key || ""} onChange={e => setConfig({ ...config, sarvam_api_key: e.target.value })} />
              </div>
            </div>
          </div>
          <div style={s.sectionCard}>
            <div style={s.sectionTitle}>Integrations</div>
            <div style={s.formRow}>
              <div style={s.formGroup}>
                <label style={s.label}>Cal.com API Key</label>
                <input style={s.input} type="password" value={config.cal_api_key || ""} onChange={e => setConfig({ ...config, cal_api_key: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Cal.com Event Type ID</label>
                <input style={s.input} value={config.cal_event_type_id || ""} onChange={e => setConfig({ ...config, cal_event_type_id: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Telegram Bot Token</label>
                <input style={s.input} type="password" value={config.telegram_bot_token || ""} onChange={e => setConfig({ ...config, telegram_bot_token: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Telegram Chat ID</label>
                <input style={s.input} value={config.telegram_chat_id || ""} onChange={e => setConfig({ ...config, telegram_chat_id: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Supabase URL</label>
                <input style={s.input} value={config.supabase_url || ""} onChange={e => setConfig({ ...config, supabase_url: e.target.value })} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Supabase Anon Key</label>
                <input style={s.input} type="password" value={config.supabase_key || ""} onChange={e => setConfig({ ...config, supabase_key: e.target.value })} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>⚠️ Credentials here override .env values at runtime. Never share this page.</div>
            <button style={s.btnPrimary} onClick={() => saveSection("credentials", {
              livekit_url: config.livekit_url, sip_trunk_id: config.sip_trunk_id,
              livekit_api_key: config.livekit_api_key, livekit_api_secret: config.livekit_api_secret,
              openai_api_key: config.openai_api_key, sarvam_api_key: config.sarvam_api_key,
              cal_api_key: config.cal_api_key, cal_event_type_id: config.cal_event_type_id,
              telegram_bot_token: config.telegram_bot_token, telegram_chat_id: config.telegram_chat_id,
              supabase_url: config.supabase_url, supabase_key: config.supabase_key,
            })}>💾 Save Credentials</button>
          </div>
        </div>
      )}
    </div>
  );
}
