import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useBusiness } from "../api/businessContext";
import {
  getCalendlyStatus, getCalendlyOAuthUrl, getCalendlyEventTypes,
  setCalendlyEventType, disconnectCalendly,
  getGCalOAuthUrl, getGCalStatus, getGCalCalendars, setGCalCalendar, disconnectGCal,
  getGCalBookings,
} from "../api/client";

// ── Shared styles ────────────────────────────────────────────────────────────
const S = {
  page: { padding: "0 0 40px", maxWidth: 1200 },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 800, color: "var(--fg)", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "var(--muted)", lineHeight: 1.6 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 12, marginTop: 32 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20, marginBottom: 8 },
  card: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px", transition: "all 0.2s ease" },
  cardHL: { borderColor: "var(--accent)", background: "rgba(124,58,237,0.05)" },
  icon: { fontSize: 32, marginBottom: 12 },
  name: { fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 6 },
  desc: { fontSize: 13, color: "var(--muted)", marginBottom: 14, lineHeight: 1.5 },
  features: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  feat: { fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 },
  badge: { display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, marginBottom: 12, letterSpacing: 0.3 },
  badgeOk: { background: "rgba(34,197,94,0.15)", color: "#22c55e" },
  badgeNo: { background: "rgba(239,68,68,0.1)", color: "#f87171" },
  dot: { width: 6, height: 6, borderRadius: "50%", background: "currentColor" },
  btn: { width: "100%", padding: "10px", border: "1px solid var(--border)", borderRadius: 8, background: "rgba(124,58,237,0.1)", color: "var(--accent)", cursor: "pointer", fontSize: 13, fontWeight: 700, transition: "all 0.2s ease", marginBottom: 8 },
  btnOk: { background: "rgba(34,197,94,0.1)", color: "#22c55e", borderColor: "rgba(34,197,94,0.2)" },
  btnDgr: { background: "rgba(239,68,68,0.1)", color: "#f87171", borderColor: "rgba(239,68,68,0.2)" },
  select: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg)", fontSize: 13, marginBottom: 8, cursor: "pointer" },
  label: { fontSize: 12, color: "var(--muted)", marginBottom: 4, display: "block" },
  info: { background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "var(--fg)", marginBottom: 12, wordBreak: "break-all" },
  alert: { background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#22c55e", marginBottom: 12 },
  alertE: { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#f87171", marginBottom: 12 },
  tip: { background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: "20px", marginTop: 32 },
};

const OTHERS = [
  { id: "n8n", name: "n8n", icon: "⚙️", desc: "Open-source workflow automation", features: ["Workflow automation", "No-code integration", "Self-hosted"] },
  { id: "zapier", name: "Zapier", icon: "⚡", desc: "Automate tasks between apps", features: ["5000+ integrations", "Zaps workflow", "Task automation"] },
  { id: "slack", name: "Slack", icon: "💬", desc: "Real-time team notifications", features: ["Direct notifications", "Channel integration", "Bot commands"] },
  { id: "sheets", name: "Google Sheets", icon: "📊", desc: "Sync data to spreadsheets", features: ["Real-time sync", "Data analysis", "Collaborative"] },
  { id: "hooks", name: "Webhooks", icon: "🔗", desc: "Custom webhook endpoints", features: ["Custom events", "Real-time data", "API integration"] },
];

// ── Reusable connection card shell ────────────────────────────────────────────
function ConnectCard({ icon, name, desc, features, status, children }) {
  const [hl, setHl] = useState(false);
  const connected = status?.connected;
  return (
    <div style={{ ...S.card, ...(hl ? S.cardHL : {}) }}
      onMouseEnter={() => setHl(true)} onMouseLeave={() => setHl(false)}>
      <div style={S.icon}>{icon}</div>
      <div style={{ ...S.badge, ...(connected ? S.badgeOk : S.badgeNo) }}>
        <span style={S.dot} />
        {status === null ? "Checking…" : connected ? "Connected" : "Disconnected"}
      </div>
      <div style={S.name}>{name}</div>
      <div style={S.desc}>{desc}</div>
      <div style={S.features}>{features.map((f, i) => <div key={i} style={S.feat}><span>✓</span>{f}</div>)}</div>
      {children}
    </div>
  );
}

// ── Google Calendar Card ──────────────────────────────────────────────────────
function GoogleCalendarCard({ businessId }) {
  const [status, setStatus] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [selId, setSelId] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const loadStatus = useCallback(async () => {
    if (!businessId) return;
    const s = await getGCalStatus(businessId).catch(() => ({ connected: false }));
    setStatus(s);
    if (s.connected && s.selected_calendar_id) setSelId(s.selected_calendar_id);
  }, [businessId]);

  const loadCalendars = useCallback(async () => {
    if (!businessId) return;
    const cals = await getGCalCalendars(businessId).catch(() => []);
    setCalendars(cals);
  }, [businessId]);

  useEffect(() => { loadStatus(); }, [loadStatus]);
  useEffect(() => { if (status?.connected) loadCalendars(); }, [status?.connected, loadCalendars]);

  const handleConnect = async () => {
    if (!businessId) { setErr("No business ID found."); return; }
    setLoading(true); setErr("");
    try { window.location.href = await getGCalOAuthUrl(businessId); }
    catch (e) { setErr("Could not start Google auth. Check GOOGLE_CLIENT_ID in .env."); setLoading(false); }
  };

  const handleSave = async () => {
    if (!selId) return;
    setSaving(true); setErr("");
    try {
      const cal = calendars.find(c => c.id === selId) || { id: selId, summary: selId };
      await setGCalCalendar(businessId, cal);
      setOk(`✓ Calendar "${cal.summary}" set for auto-booking.`);
      await loadStatus();
      setTimeout(() => setOk(""), 4000);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect Google Calendar?")) return;
    setErr("");
    try {
      await disconnectGCal(businessId);
      setStatus({ connected: false }); setCalendars([]); setSelId("");
      setOk("Google Calendar disconnected."); setTimeout(() => setOk(""), 3000);
    } catch (e) { setErr(e.message); }
  };

  return (
    <ConnectCard icon="🗓️" name="Google Calendar" desc="Auto-book meetings directly into your Google Calendar from WhatsApp. Tokens are saved — connect once, it stays connected." features={["Persistent OAuth connection", "WhatsApp auto-booking", "Auto token refresh", "Real calendar events"]} status={status}>
      {err && <div style={S.alertE}>⚠ {err}</div>}
      {ok && <div style={S.alert}>{ok}</div>}
      {!status?.connected ? (
        <button style={S.btn} onClick={handleConnect} disabled={loading}>
          {loading ? "Redirecting to Google…" : "🔗 Connect Google Calendar"}
        </button>
      ) : (
        <>
          <div style={S.info}>
            <strong>{status.google_user_name || status.google_user_email}</strong>
            <div style={{ opacity: 0.7, fontSize: 11, marginTop: 2 }}>{status.google_user_email}</div>
            {status.selected_calendar_name && (
              <div style={{ marginTop: 4, color: "#a78bfa" }}>📅 {status.selected_calendar_name}</div>
            )}
          </div>

          {calendars.length > 0 && (
            <>
              <label style={S.label}>Booking destination calendar</label>
              <select style={S.select} value={selId} onChange={e => setSelId(e.target.value)}>
                <option value="">— select a calendar —</option>
                {calendars.map(c => (
                  <option key={c.id} value={c.id}>{c.summary}{c.primary ? " (Primary)" : ""}</option>
                ))}
              </select>
              <button style={{ ...S.btn, ...S.btnOk }} onClick={handleSave} disabled={saving || !selId}>
                {saving ? "Saving…" : "✓ Save calendar"}
              </button>
            </>
          )}

          <button style={{ ...S.btn, ...S.btnDgr }} onClick={handleDisconnect}>Disconnect</button>
        </>
      )}
    </ConnectCard>
  );
}

// ── Google Calendar + Booked Calls ───────────────────────────────────────────
function GoogleCalendarBookingCard({ businessId }) {
  const [status, setStatus] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [selId, setSelId] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const loadStatus = useCallback(async () => {
    if (!businessId) return;
    const s = await getGCalStatus(businessId).catch(() => ({ connected: false }));
    setStatus(s);
    if (s.connected && s.selected_calendar_id) setSelId(s.selected_calendar_id);
  }, [businessId]);

  const loadCalendars = useCallback(async () => {
    if (!businessId) return;
    const cals = await getGCalCalendars(businessId).catch(() => []);
    setCalendars(cals);
  }, [businessId]);

  const loadBookings = useCallback(async () => {
    if (!businessId) return;
    setLoadingBookings(true);
    try {
      const data = await getGCalBookings(businessId, 30);
      setBookings(data);
    } catch (e) {
      setBookings([]);
      // silently ignore — token/permission issues surface via empty state
    } finally {
      setLoadingBookings(false);
    }
  }, [businessId]);

  useEffect(() => { loadStatus(); }, [loadStatus]);
  useEffect(() => {
    if (status?.connected) {
      loadCalendars();
      loadBookings();
    }
  }, [status?.connected, loadCalendars, loadBookings]);

  // Auto-refresh bookings every 10 seconds when connected
  useEffect(() => {
    if (!status?.connected) return;
    const interval = setInterval(() => {
      loadBookings();
    }, 10000);
    return () => clearInterval(interval);
  }, [status?.connected, loadBookings]);

  const handleConnect = async () => {
    if (!businessId) { setErr("No business ID found."); return; }
    setLoading(true); setErr("");
    try { window.location.href = await getGCalOAuthUrl(businessId); }
    catch (e) { setErr("Could not start Google auth. Check GOOGLE_CLIENT_ID in .env."); setLoading(false); }
  };

  const handleSave = async () => {
    if (!selId) return;
    setSaving(true); setErr("");
    try {
      const cal = calendars.find(c => c.id === selId) || { id: selId, summary: selId };
      await setGCalCalendar(businessId, cal);
      setOk(`✓ Calendar "${cal.summary}" set for WhatsApp auto-booking.`);
      await loadStatus();
      await loadBookings();
      setTimeout(() => setOk(""), 4000);
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Disconnect Google Calendar?")) return;
    setErr("");
    try {
      await disconnectGCal(businessId);
      setStatus({ connected: false }); setCalendars([]); setSelId(""); setBookings([]);
      setOk("Google Calendar disconnected."); setTimeout(() => setOk(""), 3000);
    } catch (e) { setErr(e.message); }
  };

  const formatDateTime = (isoStr) => {
    if (!isoStr) return "—";
    try {
      return new Date(isoStr).toLocaleString("en-IN", {
        weekday: "short", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return isoStr; }
  };

  return (
    <ConnectCard icon="🗓️" name="Google Calendar + Booking" desc="Customers book appointments directly from WhatsApp. Orion auto-creates calendar events — booked calls appear below." features={["WhatsApp-driven booking", "Auto-confirmation", "Calendar sync", "Real calendar events"]} status={status}>
      {err && <div style={S.alertE}>⚠ {err}</div>}
      {ok && <div style={S.alert}>{ok}</div>}

      {!status?.connected ? (
        <button style={S.btn} onClick={handleConnect} disabled={loading}>
          {loading ? "Redirecting to Google…" : "🔗 Connect Google Calendar"}
        </button>
      ) : (
        <>
          <div style={S.info}>
            <strong>{status.google_user_name || status.google_user_email}</strong>
            <div style={{ opacity: 0.7, fontSize: 11, marginTop: 2 }}>{status.google_user_email}</div>
            {status.selected_calendar_name && (
              <div style={{ marginTop: 4, color: "#a78bfa" }}>📅 {status.selected_calendar_name}</div>
            )}
          </div>

          {calendars.length > 0 && (
            <>
              <label style={S.label}>Booking destination calendar</label>
              <select style={S.select} value={selId} onChange={e => setSelId(e.target.value)}>
                <option value="">— select a calendar —</option>
                {calendars.map(c => (
                  <option key={c.id} value={c.id}>{c.summary}{c.primary ? " (Primary)" : ""}</option>
                ))}
              </select>
              <button style={{ ...S.btn, ...S.btnOk }} onClick={handleSave} disabled={saving || !selId}>
                {saving ? "Saving…" : "✓ Save calendar"}
              </button>
            </>
          )}

          {/* Booked Calls Section */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ ...S.label, marginBottom: 0, fontWeight: 700, fontSize: 13, color: "var(--fg)" }}>
                📋 Booked Calls
              </label>
              <button
                onClick={loadBookings}
                disabled={loadingBookings}
                style={{ fontSize: 11, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", opacity: loadingBookings ? 0.5 : 1 }}
              >
                {loadingBookings ? "Refreshing…" : "↻ Refresh"}
              </button>
            </div>

            {loadingBookings ? (
              <div style={{ fontSize: 12, color: "var(--muted)", padding: "12px 0", textAlign: "center" }}>Loading bookings…</div>
            ) : bookings.length === 0 ? (
              <div style={{ fontSize: 12, color: "var(--muted)", padding: "16px", textAlign: "center", background: "rgba(124,58,237,0.05)", borderRadius: 8, border: "1px dashed var(--border)" }}>
                <div style={{ marginBottom: 6 }}>📅 No upcoming bookings.</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Bookings will appear here when customers book via WhatsApp.</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 400, overflowY: "auto" }}>
                {bookings.map(b => (
                  <div key={b.id} style={{ padding: "12px 14px", background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(124,58,237,0.06))", borderRadius: 10, border: "1px solid rgba(124,58,237,0.25)" }}>
                    <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>📞 {b.title}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 3 }}>🕐 {b.start ? new Date(b.start).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</div>
                        {b.customer_name && <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>👤 {b.customer_name}</div>}
                        {b.customer_phone && <div style={{ fontSize: 11, color: "var(--muted)" }}>📱 {b.customer_phone}</div>}
                      </div>
                      <span style={{ fontSize: 10, padding: "4px 8px", background: "rgba(34,197,94,0.2)", color: "#22c55e", borderRadius: 4, fontWeight: 700, whiteSpace: "nowrap" }}>✓ Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button style={{ ...S.btn, ...S.btnDgr, marginTop: 12 }} onClick={handleDisconnect}>Disconnect</button>
        </>
      )}
    </ConnectCard>
  );
}

// ── Static service card ───────────────────────────────────────────────────────
function ServiceCard({ service }) {
  const [hl, setHl] = useState(false);
  const [on, setOn] = useState(false);
  return (
    <div style={{ ...S.card, ...(hl ? S.cardHL : {}) }}
      onMouseEnter={() => setHl(true)} onMouseLeave={() => setHl(false)}>
      <div style={S.icon}>{service.icon}</div>
      <div style={{ ...S.badge, ...(on ? S.badgeOk : S.badgeNo) }}><span style={S.dot} />{on ? "Connected" : "Disconnected"}</div>
      <div style={S.name}>{service.name}</div>
      <div style={S.desc}>{service.desc}</div>
      <div style={S.features}>{service.features.map((f, i) => <div key={i} style={S.feat}><span>✓</span>{f}</div>)}</div>
      <button style={{ ...S.btn, ...(on ? S.btnOk : {}) }} onClick={() => setOn(c => !c)}>
        {on ? "✓ Connected" : "Connect"}
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ExternalConnectivitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [oauthMsg, setOauthMsg] = useState(null);
  const { businessId } = useBusiness();

  useEffect(() => {
    const gcal = searchParams.get("gcal");
    const cal = searchParams.get("calendly");
    const reason = searchParams.get("reason");
    if (gcal === "connected") {
      setOauthMsg({ type: "success", text: "✓ Google Calendar connected! Reloading..." });
      // Auto-reload after 1.5 seconds to refresh connection status
      setTimeout(() => window.location.reload(), 1500);
    }
    else if (gcal === "error") setOauthMsg({ type: "error", text: `Google Calendar error: ${reason || "unknown"}` });
    else if (cal === "connected") setOauthMsg({ type: "success", text: "✓ Calendly connected! Pick your event type below." });
    else if (cal === "error") setOauthMsg({ type: "error", text: `Calendly error: ${reason || "unknown"}` });
    if (gcal || cal) setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  return (
    <div style={S.page}>
      {oauthMsg && (
        <div style={oauthMsg.type === "success" ? S.alert : S.alertE}>
          {oauthMsg.text}
          <span style={{ float: "right", cursor: "pointer", opacity: 0.7 }} onClick={() => setOauthMsg(null)}>✕</span>
        </div>
      )}

      <div style={S.sectionTitle}>📆 Scheduling & Booking</div>
      <div style={{ ...S.grid, gridTemplateColumns: "repeat(3, 1fr)" }}>
        <GoogleCalendarBookingCard businessId={businessId} />
        {/* Place Google Sheets and Webhooks beside the calendar */}
        <ServiceCard service={OTHERS.find(s => s.id === "sheets")} />
        <ServiceCard service={OTHERS.find(s => s.id === "hooks")} />
      </div>

      <div style={S.sectionTitle}>⚙️ Automation & Other</div>
      <div style={{ ...S.grid, gridTemplateColumns: "repeat(3, 1fr)" }}>
        {OTHERS.filter(s => s.id !== "sheets" && s.id !== "hooks").map(s => <ServiceCard key={s.id} service={s} />)}
      </div>
    </div>
  );
}
