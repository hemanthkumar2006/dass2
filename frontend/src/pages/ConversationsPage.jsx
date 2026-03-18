import { useMemo, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import IntentBadge from "../components/IntentBadge";
import { useBusiness } from "../api/businessContext";
import { getConversations } from "../api/client";

function statusToLabel(status) {
  if (status === "escalated") return "URGENT";
  return "ROUTINE";
}

// Read intent from latest message metadata (returned as top-level `intent` field by the API)
function getIntent(c) {
  const raw = c.intent;  // set by getConversationsByBusiness subquery
  if (raw) {
    const cap = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    if (["High", "Medium", "Low"].includes(cap)) return cap;
  }
  if (c.status === "escalated") return "High";
  if (c.status === "booked") return "Medium";
  return "Low";
}

function relativeTime(isoStr) {
  if (!isoStr) return "—";
  const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function getInitials(name, phone) {
  if (name && name.trim()) {
    return name.trim().split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  }
  if (phone) return phone.slice(-2).toUpperCase();
  return "??";
}

export default function ConversationsPage() {
  const { businessId } = useBusiness();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c => {
      const name = (c.display_name || c.phone_number || "").toLowerCase();
      const status = (c.status || "").toLowerCase();
      return name.includes(q) || status.includes(q);
    });
  }, [query, conversations]);

  if (loading) {
    return (
      <div className="stack">
        <div className="convListCard">
          <div style={{ padding: 20, color: "var(--muted)", fontSize: 13 }}>Loading conversations…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      {/* Search bar */}
      <div style={{ marginBottom: 4 }}>
        <input
          className="composerInput"
          style={{ width: "100%", padding: "9px 14px", borderRadius: 8, background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--fg)", fontSize: 13 }}
          placeholder="Search by name or phone…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="convListCard">
        {filtered.length === 0 ? (
          <div style={{ padding: "20px 16px", color: "var(--muted)", fontSize: 13 }}>
            {conversations.length === 0
              ? "No conversations yet. WhatsApp messages will appear here."
              : "No results match your search."}
          </div>
        ) : (
          filtered.map((c) => {
            const label = statusToLabel(c.status);
            const initials = getInitials(c.display_name, c.phone_number);
            const displayName = c.display_name || c.phone_number || "Unknown";
            const intent = getIntent(c);
            return (
              <Link to={`/conversations/${c.id}`} key={c.id} className="convListItem">
                <div className="leadAvatar">{initials}</div>
                <div className="convListInfo">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="convListName">{displayName}</span>
                    <span className={`pill ${label === "URGENT" ? "pill-warn" : "pill-muted"}`} style={{ fontSize: 10, padding: "2px 7px" }}>
                      {label}
                    </span>
                  </div>
                  <div className="convListMsg">{c.phone_number || "—"}</div>
                  <div style={{ marginTop: 6 }}>
                    <div style={{ height: 2, background: "rgba(124,58,237,0.2)", borderRadius: 99, width: label === "URGENT" ? "60%" : "30%", overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "var(--accent)", borderRadius: 99, width: "50%" }} />
                    </div>
                  </div>
                </div>
                <div className="convListMeta">
                  <span className="convListTime">{relativeTime(c.updated_at)}</span>
                  <IntentBadge intent={intent} />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}