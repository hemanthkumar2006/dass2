import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IntentBadge from "../components/IntentBadge";
import { useBusiness } from "../api/businessContext";
import { getConversations, getConversationMessages, sendMessage } from "../api/client";

// ── Icons (unchanged from original) ─────────────────────────────
const HoldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
  </svg>
);
const ApproveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const DataIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);
const PathIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const WaveIcon = () => (
  <svg width="13" height="10" viewBox="0 0 14 10" fill="none">
    <path d="M1 5h2M5 3v4M9 2v6M13 5h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Helpers ──────────────────────────────────────────────────────
function getInitials(name, phone) {
  if (name && name.trim()) return name.trim().split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  if (phone) return phone.slice(-2).toUpperCase();
  return "??";
}

function formatTime(isoStr) {
  if (!isoStr) return "";
  return new Date(isoStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function senderToFrom(senderType) {
  if (senderType === "customer") return "user";
  return "bot"; // ai or human (agent) — shown on right side
}

function statusToLabel(status) {
  if (status === "escalated") return "URGENT";
  return "ROUTINE";
}

// ── Component ────────────────────────────────────────────────────
export default function ConversationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { businessId } = useBusiness();

  // Current conversation metadata
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [manualMsg, setManualMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // Load all conversations (for queue panel + header)
  useEffect(() => {
    if (!businessId) return;
    getConversations(businessId).then(setConversations).catch(() => { });
  }, [businessId]);

  // Load messages for this conversation, poll every 5s
  const loadMessages = useCallback(() => {
    if (!id) return;
    getConversationMessages(id)
      .then(setMessages)
      .catch(() => { })
      .finally(() => setLoadingMsgs(false));
  }, [id]);

  useEffect(() => {
    setLoadingMsgs(true);
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  const current = useMemo(() => conversations.find(c => c.id === id), [conversations, id]);
  const queue = useMemo(() => conversations.filter(c => c.status === "escalated" || c.status === "active").slice(0, 5), [conversations]);

  const displayName = current?.display_name || current?.phone_number || "Unknown";
  const phone = current?.phone_number || "—";
  const initials = getInitials(current?.display_name, current?.phone_number);
  const isEscalated = current?.status === "escalated";

  // Send message handler
  const handleSend = async () => {
    if (!manualMsg.trim() || !businessId || !phone || phone === "—") return;
    setSending(true);
    setSendError("");
    try {
      await sendMessage({ businessId, customerPhone: phone, text: manualMsg.trim() });
      setManualMsg("");
      loadMessages();
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Detail-page top header */}
      <div className="detailHead">
        <div className="detailHeadLeft">
          <div className="leadAvatar" style={{ width: 44, height: 44, fontSize: 14 }}>{initials}</div>
          <div>
            <div className="detailHeadName">{displayName}</div>
            <div className="detailHeadSub">{phone} · {current?.status || "active"}</div>
          </div>
        </div>
        <div className="detailHeadActions">
          {isEscalated && <span className="pill pill-warn">● INTERVENTION REQUIRED</span>}
          <button className="btn btn-ghost" style={{ gap: 6 }}>
            <HoldIcon /> Hold Agent
          </button>
          <button className="btn btn-primary" style={{ gap: 6 }}>
            <ApproveIcon /> Approve Draft
          </button>
        </div>
      </div>

      {/* 3-panel grid */}
      <div className="detailGrid" style={{ flex: 1, minHeight: 0 }}>

        {/* ── Left: Intervention Queue ── */}
        <div className="queueCard">
          <div className="queueHead">
            <span className="queueTitle">
              <WaveIcon style={{ marginRight: 4 }} /> Intervention Queue
            </span>
            <span className="pill pill-muted" style={{ fontSize: 11 }}>{queue.length}</span>
          </div>
          <div className="queueList">
            {queue.map((q) => {
              const label = statusToLabel(q.status);
              const qName = q.display_name || q.phone_number || "Unknown";
              return (
                <div
                  key={q.id}
                  className={`queueItem ${q.id === id ? "active" : ""}`}
                  onClick={() => navigate(`/conversations/${q.id}`)}
                >
                  <div className="queueItemTop">
                    <div className="queueItemName">{qName}</div>
                    <span className={`pill ${label === "URGENT" ? "pill-warn" : "pill-muted"}`} style={{ fontSize: 10, padding: "1px 6px" }}>
                      {label}
                    </span>
                  </div>
                  <div className="queueItemMsg">{q.phone_number || "—"}</div>
                  <div className="queueItemBar">
                    <div className="queueItemBarFill" style={{ width: label === "URGENT" ? "60%" : "30%" }} />
                  </div>
                  <div className="queueItemTime">{q.status}</div>
                </div>
              );
            })}
            {queue.length === 0 && (
              <div style={{ padding: "12px 14px", color: "var(--muted)", fontSize: 12 }}>No active conversations.</div>
            )}
          </div>
        </div>

        {/* ── Center: WhatsApp Live Session ── */}
        <div className="chatCard">
          <div className="chatPanelHead">
            <span className="chatPanelTitle">
              <WaveIcon style={{ marginRight: 6 }} /> WhatsApp Live Session
            </span>
            <span className="encBadge">
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--good)", display: "inline-block" }} />
              END-TO-END ENCRYPTED
            </span>
          </div>

          <div className="chatBody">
            {loadingMsgs ? (
              <div style={{ padding: 20, color: "var(--muted)", fontSize: 13 }}>Loading messages…</div>
            ) : messages.length === 0 ? (
              <div style={{ padding: 20, color: "var(--muted)", fontSize: 13 }}>No messages yet.</div>
            ) : (
              messages.map((m, idx) => {
                const from = senderToFrom(m.sender_type);
                return (
                  <div key={m.id || idx} className={`bubbleRow ${from === "bot" ? "right" : "left"}`}>
                    <div className={`bubble ${from === "bot" ? "bot" : "user"}`}>
                      {from === "bot" ? (
                        <div className="bubbleFrom">
                          {formatTime(m.created_at)} &nbsp;
                          <span style={{ fontWeight: 700, color: "var(--accent)" }}>
                            {m.sender_type === "ai" ? "Orion Engine" : "Agent"}
                          </span>
                          {m.sender_type === "ai" && <span className="aiBadge">AI</span>}
                        </div>
                      ) : (
                        <div className="bubbleFrom">{displayName}</div>
                      )}
                      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{m.content}</div>
                      {from !== "bot" && <div className="bubbleMeta">{formatTime(m.created_at)}</div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Composer */}
          <div className="composer">
            <SendIcon style={{ color: "var(--muted)", flexShrink: 0 }} />
            <input
              className="composerInput"
              placeholder={phone === "—" ? "No phone number available" : "Type a manual message…"}
              value={manualMsg}
              onChange={e => setManualMsg(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={sending || phone === "—"}
            />
            <button
              className="composerSend"
              onClick={handleSend}
              disabled={sending || !manualMsg.trim() || phone === "—"}
            >
              <SendIcon />
            </button>
          </div>
          {sendError && (
            <div style={{ padding: "6px 14px", color: "#f87171", fontSize: 12 }}>❌ {sendError}</div>
          )}
        </div>

        {/* ── Right: Decision Path + Extracted Data ── */}
        <div className="rightPanels">
          {/* Decision Path */}
          <div className="rightCard">
            <div className="rightCardTitle">
              <PathIcon /> Decision Path
            </div>
            <div className="steps">
              <div className="step">
                <div className="stepDot ok">✓</div>
                <div>
                  <div className="stepTitle">GREETING</div>
                  <div className="stepSub">Contact recognized.</div>
                </div>
              </div>
              <div className="step">
                <div className="stepDot ok">✓</div>
                <div>
                  <div className="stepTitle">QUALIFICATION</div>
                  <div className="stepSub">AI response sent.</div>
                </div>
              </div>
              <div className="step">
                <div className={`stepDot ${isEscalated ? "warn" : "ok"}`}>{isEscalated ? "!" : "✓"}</div>
                <div>
                  <div className="stepTitle">STATUS</div>
                  <div className="stepSub" style={{ color: isEscalated ? "#fbbf24" : "var(--good)" }}>
                    {isEscalated ? "Needs Review" : "In Progress"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Data */}
          <div className="rightCard">
            <div className="rightCardTitle">
              <DataIcon /> Extracted Data
            </div>
            <div className="kv">
              <div className="kvRow">
                <span className="kvKey">Phone</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{phone}</span>
              </div>
              <div className="kvRow">
                <span className="kvKey">Status</span>
                <span style={{ fontWeight: 700, fontSize: 13, color: isEscalated ? "#fbbf24" : "var(--good)" }}>
                  {current?.status || "—"}
                </span>
              </div>
              <div className="kvRow">
                <span className="kvKey">Messages</span>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{messages.length}</span>
              </div>
              <div className="kvRow">
                <span className="kvKey">Urgency</span>
                <IntentBadge intent={isEscalated ? "High" : "Medium"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}