import { useState, useEffect, useCallback } from "react";
import StatCard from "../components/StatCard";
import IntentBadge from "../components/IntentBadge";
import { Link } from "react-router-dom";
import { useBusiness } from "../api/businessContext";
import { getConversations } from "../api/client";

const ConvIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const CalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const EscIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

function DonutGauge({ pct }) {
  const r = 22, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="56" height="56" viewBox="0 0 56 56">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
      <circle cx="28" cy="28" r={r} fill="none" stroke="var(--accent)" strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 28 28)" />
      <text x="28" y="33" textAnchor="middle" fill="white" fontSize="11" fontWeight="800">{pct}%</text>
    </svg>
  );
}

// Map backend conversation status to UI label
// Read intent from latest message metadata (returned as top-level `intent` field by the API)
function getIntent(c) {
  const raw = c.intent;  // set by getConversationsByBusiness subquery
  if (raw) {
    const cap = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    if (["High", "Medium", "Low"].includes(cap)) return cap;
  }
  // Fallback if no message has classified intent yet
  if (c.status === "escalated") return "High";
  if (c.status === "booked") return "Medium";
  return "Low";
}

function statusToLabel(status) {
  if (status === "escalated") return "URGENT";
  return "ROUTINE";
}

// Get initials from display_name or phone_number
function getInitials(name, phone) {
  if (name && name.trim()) {
    return name.trim().split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  }
  if (phone) return phone.slice(-2).toUpperCase();
  return "??";
}

// Relative time from ISO string
function relativeTime(isoStr) {
  if (!isoStr) return "—";
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DashboardPage() {
  const { businessId } = useBusiness();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!businessId) return;
    getConversations(businessId)
      .then(setConversations)
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, [businessId]);

  useEffect(() => {
    setLoading(true);
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [load]);

  const total = conversations.length;
  const escalated = conversations.filter(c => c.status === "escalated").length;
  const booked = conversations.filter(c => c.status === "booked").length;
  const escRate = total > 0 ? Math.round((escalated / total) * 100) : 0;
  const highIntentPct = total > 0 ? Math.round(((escalated + booked) / total) * 100) : 0;

  // Show top 10 leads in live feed
  const leads = conversations.slice(0, 10);

  return (
    <div className="stack">
      <div className="grid4">
        <StatCard
          title="Total Conversations"
          value={total.toLocaleString()}
          delta={null}
          sub="All-time WhatsApp threads"
          icon={<ConvIcon />}
          barPercent={Math.min((total / 20) * 100, 100)}
        />
        {/* High Intent Rate — special card with donut */}
        <div className="card statCard">
          <div className="statTop">
            <div className="statLabel">High Intent Rate</div>
            <DonutGauge pct={highIntentPct} />
          </div>
          <div className="statValue" style={{ marginTop: 4 }}>{highIntentPct}%</div>
          <div className="statSub">Escalated + Booked</div>
        </div>
        <StatCard
          title="Bookings Made"
          value={booked.toString()}
          delta={null}
          sub="Booked conversations"
          icon={<CalIcon />}
          barPercent={Math.min((booked / 10) * 100, 100)}
        />
        <StatCard
          title="Escalation Rate"
          value={`${escRate}%`}
          delta={null}
          sub="Critical threshold: 10%"
          icon={<EscIcon />}
          barPercent={escRate}
        />
      </div>

      {/* Live Feed */}
      <div className="card">
        <div className="cardHeaderRow">
          <div>
            <div className="cardTitle liveFeedTitle">
              <span className="liveFeedIcon">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5h2M5 3v4M9 2v6M13 5h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              Live Feed: Active WhatsApp Leads
            </div>
          </div>
          <div className="segmented">
            <button className="segBtn active">All Leads</button>
            <button className="segBtn">Flagged</button>
          </div>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(160px,1.2fr) minmax(200px,2fr) 130px 110px 90px", gap: 14, padding: "10px 14px", borderBottom: "1px solid var(--border)", fontSize: 11, fontWeight: 700, letterSpacing: "0.8px", color: "var(--muted)", textTransform: "uppercase" }}>
          <div>Lead Information</div><div>Last Updated</div><div>Intent Level</div><div>Status</div><div style={{ textAlign: "right" }}>Actions</div>
        </div>

        {loading ? (
          <div style={{ padding: "20px 14px", color: "var(--muted)", fontSize: 13 }}>
            Loading conversations…
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding: "20px 14px", color: "var(--muted)", fontSize: 13 }}>
            No conversations yet. WhatsApp messages will appear here in real-time.
          </div>
        ) : (
          leads.map((c) => {
            const label = statusToLabel(c.status);
            const initials = getInitials(c.display_name, c.phone_number);
            const displayName = c.display_name || c.phone_number || "Unknown";
            const intent = getIntent(c);
            return (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "minmax(160px,1.2fr) minmax(200px,2fr) 130px 110px 90px", gap: 14, padding: "13px 14px", borderBottom: "1px solid var(--border)", alignItems: "center", fontSize: 13.5 }}>
                <div className="leadCell">
                  <div className="leadAvatar">{initials}</div>
                  <div>
                    <div className="leadName">{displayName}</div>
                    <div className="leadSub">{c.phone_number || "—"}</div>
                  </div>
                </div>
                <div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {relativeTime(c.updated_at)}
                  </div>
                </div>
                <div><IntentBadge intent={intent} /></div>
                <div className="muted" style={{ fontSize: 12 }}>{c.status}</div>
                <div style={{ textAlign: "right" }}>
                  <Link className="btn btn-primary" to={`/conversations/${c.id}`} style={{ fontSize: 12, padding: "6px 12px" }}>Open</Link>
                </div>
              </div>
            );
          })
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", fontSize: 12, color: "var(--muted)" }}>
          <span>Showing {Math.min(leads.length, 10)} of {total} conversations</span>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-ghost" style={{ width: 30, height: 30, padding: 0 }}>‹</button>
            <button className="btn btn-ghost" style={{ width: 30, height: 30, padding: 0 }}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}