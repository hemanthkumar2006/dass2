import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useBusiness } from "../api/businessContext";
import { useAuth } from "../contexts/AuthContext";
import { getBusinessById, getConversations } from "../api/client";
import HelpModal from "./HelpModal";
import "../App.css";

/* ── SVG icons ──────────────────────────────────────────────── */
const DashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const ConvIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const AnalyticsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const AgentsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M12 11V7" /><circle cx="12" cy="5" r="2" /><path d="M7 11V9a5 5 0 0 1 10 0v2" />
  </svg>
);
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const HelpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const ConnectIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="2" /><line x1="12" y1="9" x2="12" y2="15" /><circle cx="8" cy="12" r="1" /><circle cx="16" cy="12" r="1" />
  </svg>
);

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: DashIcon },
  { label: "Conversations", to: "/conversations", icon: ConvIcon },
  { label: "Analytics", to: "/analytics", icon: AnalyticsIcon },
  { label: "Agent Management", to: "/agents", icon: AgentsIcon },
  { label: "External Connectivities", to: "/external-connectivities", icon: ConnectIcon },
  { label: "Bot Types", to: "/bot-types", icon: BotIcon },
];

/* Agent sub-navigation items */
const AgentOverviewIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);
const AgentKBIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const AgentWebIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const AgentLinkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const agentSubNav = [
  { label: "Overview", to: "/agents/overview", icon: AgentOverviewIcon },
  { label: "Knowledge Base", to: "/agents/knowledge", icon: AgentKBIcon },
  { label: "Websites", to: "/agents/websites", icon: AgentWebIcon },
  { label: "Links", to: "/agents/links", icon: AgentLinkIcon },
];

/* ── page-level metadata ──────────────────────────────────── */
function usePage(pathname) {
  return useMemo(() => {
    if (pathname.startsWith("/conversations/")) return {
      title: null, // rendered inside the page
      sub: null,
      actions: null,
      footerText: "AGENT ORION-V2-04 · US-WEST-2",
      footerRight: "ORION · V2.4.0",
      showHeader: false,
      placeholder: "Search conversations…",
    };
    if (pathname === "/conversations") return {
      title: "Conversations",
      sub: "Browse WhatsApp chats and open the full transcript",
      actions: null,
      footerText: "POWERED BY ORION ENGINE V2.4.0",
      footerRight: null,
      showHeader: true,
      placeholder: "Search conversations…",
    };
    if (pathname.startsWith("/analytics")) return {
      title: "Team Performance",
      sub: null,
      actions: "analytics",
      footerText: "POWERED BY ORION ENGINE V2.4.0",
      footerRight: null,
      showHeader: true,
      placeholder: "Search across agents and conversations…",
    };
    if (pathname.startsWith("/agents")) return {
      title: "AI Agents",
      sub: "Deploy and manage your specialized autonomous sales fleet.",
      actions: "agents",
      footerText: "POWERED BY ORION ENGINE V2.4.0",
      footerRight: null,
      showHeader: true,
      placeholder: "Search agents, nodes, or metrics…",
    };
    if (pathname.startsWith("/settings")) return {
      title: "Settings",
      sub: "Manage your profile, business, and preferences.",
      actions: null,
      footerText: "POWERED BY ORION ENGINE V2.4.0",
      footerRight: null,
      showHeader: true,
      placeholder: "Search settings…",
    };
    if (pathname.startsWith("/external-connectivities")) return {
      title: "External Connectivities",
      sub: "Connect Orion with external services and platforms to extend functionality.",
      actions: null,
      footerText: "POWERED BY ORION ENGINE V2.4.0",
      footerRight: null,
      showHeader: true,
      placeholder: "Search integrations…",
    };
    if (pathname.startsWith("/bot-types")) return {
      title: "Bot Types",
      sub: "Choose from specialized AI bot types tailored for different business needs.",
      actions: null,
      footerText: "POWERED BY ORION ENGINE V2.4.0",
      footerRight: null,
      showHeader: true,
      placeholder: "Search bot types…",
    };
    if (pathname.startsWith("/campaigns")) return {
      title: "Campaigns",
      sub: "Create and manage marketing campaigns to reach and engage your audience.",
      actions: null,
      footerText: "POWERED BY ORION ENGINE V2.4.0",
      footerRight: null,
      showHeader: true,
      placeholder: "Search campaigns…",
    };

    // dashboard
    return {
      title: "Sales Command Center",
      sub: "Real-time autonomous WhatsApp agent monitoring",
      actions: "dashboard",
      footerText: "POWERED BY ORION ENGINE V2.4.0",
      footerRight: null,
      showHeader: true,
      placeholder: "Search leads, transcripts or analytics…",
    };
  }, [pathname]);
}

/* ── Business Details Modal ──────────────────────────────────── */
function BusinessDetailsModal({ businessId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBusinessById(businessId);
      setDetails(data);
    } catch {
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  // Close on backdrop click
  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const overlayStyle = {
    position: "fixed", inset: 0, zIndex: 9999,
    background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  const panelStyle = {
    background: "var(--surface, #1a1a2e)", border: "1px solid var(--border, rgba(255,255,255,0.08))",
    borderRadius: 16, padding: "32px 36px", width: 480, maxWidth: "90vw",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
    position: "relative",
  };
  const rowStyle = {
    display: "flex", flexDirection: "column", gap: 2,
    padding: "12px 0", borderBottom: "1px solid var(--border, rgba(255,255,255,0.06))",
  };
  const labelStyle = { fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--muted, #888)" };
  const valueStyle = { fontSize: 13.5, fontWeight: 500, color: "var(--fg, #e2e8f0)", wordBreak: "break-all" };

  return (
    <div style={overlayStyle} onClick={handleBackdrop}>
      <div style={panelStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", color: "var(--accent, #a78bfa)", marginBottom: 4 }}>Business Details</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--fg, #e2e8f0)" }}>Orion Demo Business</h2>
          </div>
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid var(--border, rgba(255,255,255,0.08))",
            borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "var(--muted, #888)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
          }} title="Close">✕</button>
        </div>

        {loading ? (
          <div style={{ color: "var(--muted, #888)", fontSize: 13, textAlign: "center", padding: "24px 0" }}>Loading details…</div>
        ) : !details ? (
          <div style={{ color: "#f87171", fontSize: 13, textAlign: "center", padding: "24px 0" }}>Could not load business details.</div>
        ) : (
          <div>
            {/* Status badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 16,
              background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: 8, padding: "8px 14px", width: "fit-content"
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#34d399", letterSpacing: 0.5 }}>ACTIVE</span>
            </div>

            <div style={rowStyle}>
              <span style={labelStyle}>Business Name</span>
              <span style={valueStyle}>{details.name || "—"}</span>
            </div>
            <div style={rowStyle}>
              <span style={labelStyle}>Business ID</span>
              <span style={{ ...valueStyle, fontFamily: "monospace", fontSize: 12, color: "var(--muted, #888)" }}>{details.id || "—"}</span>
            </div>
            {details.email && (
              <div style={rowStyle}>
                <span style={labelStyle}>Email</span>
                <span style={valueStyle}>{details.email}</span>
              </div>
            )}
            {details.whatsapp_phone_number_id && (
              <div style={rowStyle}>
                <span style={labelStyle}>WhatsApp Phone Number ID</span>
                <span style={{ ...valueStyle, fontFamily: "monospace", fontSize: 12 }}>{details.whatsapp_phone_number_id}</span>
              </div>
            )}
            {details.business_description && (
              <div style={rowStyle}>
                <span style={labelStyle}>Description</span>
                <span style={{ ...valueStyle, fontSize: 13, lineHeight: 1.6, color: "var(--muted, #9ca3af)" }}>{details.business_description}</span>
              </div>
            )}
            {details.created_at && (
              <div style={{ ...rowStyle, borderBottom: "none" }}>
                <span style={labelStyle}>Created</span>
                <span style={{ ...valueStyle, color: "var(--muted, #888)", fontSize: 12 }}>
                  {new Date(details.created_at).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Business Selector Widget (sidebar footer) ───────────────── */
function BusinessSelectorWidget({ onOpenDetails }) {
  const { businesses, businessId, setBusinessId, loadingBusinesses, backendOnline } = useBusiness();

  if (loadingBusinesses) {
    return (
      <div style={{ fontSize: 11, color: "var(--muted)" }}>Connecting to backend…</div>
    );
  }

  if (!backendOnline) {
    return (
      <div>
        <div style={{ fontSize: 10, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)" }}>
          System Status
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <span className="dot" style={{ background: "#f87171", width: 7, height: 7, borderRadius: "50%", flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "#f87171" }}>Backend Offline</span>
        </div>
        <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4 }}>
          Start backend on port 3000
        </div>
      </div>
    );
  }

  if (businesses.length === 1) {
    return (
      <div>
        <div style={{ fontSize: 10, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)" }}>
          Business
        </div>
        <button
          onClick={() => onOpenDetails(businesses[0].id)}
          style={{
            display: "flex", alignItems: "center", gap: 8, marginTop: 8,
            background: "transparent", border: "none", padding: 0,
            cursor: "pointer", width: "100%", textAlign: "left",
          }}
          title="Click to view business details"
        >
          <span className="dot dot-green" />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)" }}>{businesses[0].name}</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--muted)", opacity: 0.7 }}>↗</span>
        </button>
      </div>
    );
  }

  // Multiple businesses — show dropdown
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: 1, fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
        Active Business
      </div>
      <select
        value={businessId}
        onChange={e => setBusinessId(e.target.value)}
        style={{
          width: "100%", background: "var(--surface2)", border: "1px solid var(--border)",
          color: "var(--fg)", borderRadius: 6, padding: "5px 8px", fontSize: 12, cursor: "pointer",
        }}
      >
        {businesses.map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <button
        onClick={() => businessId && onOpenDetails(businessId)}
        style={{ marginTop: 6, fontSize: 11, color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        View details ↗
      </button>
    </div>
  );
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { businessId } = useBusiness();
  const [q, setQ] = useState("");
  const [bizModalId, setBizModalId] = useState(null);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignType, setCampaignType] = useState("lead-gen");
  const [exportLoading, setExportLoading] = useState(false);
  const page = usePage(pathname);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // CSV Export Handler
  const handleExportReport = useCallback(async () => {
    if (!businessId || exportLoading) return;
    setExportLoading(true);
    try {
      const conversations = await getConversations(businessId);
      
      // Prepare CSV headers
      const headers = ["Name", "Phone", "Status", "Intent", "Last Message", "Created At"];
      
      // Prepare CSV rows
      const rows = conversations.map(c => [
        c.display_name || c.phone_number || "N/A",
        c.phone_number || "N/A",
        c.status || "N/A",
        c.intent || "N/A",
        c.last_message || "N/A",
        c.created_at ? new Date(c.created_at).toLocaleString() : "N/A"
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      ].join("\n");
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `orion-conversations-${new Date().getTime()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExportLoading(false);
    }
  }, [businessId, exportLoading]);

  // Campaign Creation Handler
  const handleCreateCampaign = () => {
    if (!campaignName.trim()) return;
    // For now, navigate to show campaign creation
    navigate(`/campaigns?create=true&name=${encodeURIComponent(campaignName)}&type=${campaignType}`);
    setCampaignName("");
    setCampaignType("lead-gen");
    setCampaignModalOpen(false);
  };

  const onSearchEnter = (e) => {
    if (e.key !== "Enter") return;
    // Route search to the appropriate page based on current location
    if (pathname.startsWith("/conversations")) {
      navigate(`/conversations?q=${encodeURIComponent(q)}`);
    } else if (pathname.startsWith("/dashboard")) {
      navigate(`/dashboard?q=${encodeURIComponent(q)}`);
    } else if (pathname.startsWith("/analytics")) {
      navigate(`/analytics?q=${encodeURIComponent(q)}`);
    } else if (pathname.startsWith("/agents")) {
      navigate(`/agents/overview?q=${encodeURIComponent(q)}`);
    }
  };

  // const isDetail = pathname.startsWith("/conversations/"); // reserved for future use
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard");

  return (
    <div className="appShell">
      {/* ── Sidebar ──────────────────────────────────── */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">✦</div>
          <div>
            <div className="brandName">Orion <span style={{ color: "var(--accent)" }}>AI</span></div>
            <div className="brandSub">Autonomous</div>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((it) => {
            const Icon = it.icon;
            const isAgents = it.to === "/agents";
            const agentsActive = pathname.startsWith("/agents");
            return (
              <div key={it.to}>
                <NavLink
                  to={isAgents ? "/agents/overview" : it.to}
                  className={({ isActive }) =>
                    "navItem " + (isAgents ? (agentsActive ? "active" : "") : (isActive ? "active" : ""))
                  }
                  end={it.to === "/dashboard"}
                >
                  <Icon />
                  <span>{it.label}</span>
                </NavLink>
                {/* Agent sub-nav — shown only when on /agents/* */}
                {isAgents && agentsActive && (
                  <div style={{ marginTop: 2, marginBottom: 4 }}>
                    {agentSubNav.map((sub) => {
                      const SubIcon = sub.icon;
                      const subActive = pathname === sub.to;
                      return (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "7px 12px 7px 32px",
                            borderRadius: 8, textDecoration: "none",
                            fontSize: 12.5, fontWeight: subActive ? 600 : 400,
                            color: subActive ? "var(--accent)" : "var(--muted)",
                            background: subActive ? "rgba(124,58,237,0.12)" : "transparent",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <SubIcon />
                          <span>{sub.label}</span>
                          {subActive && (
                            <span style={{ marginLeft: "auto", width: 3, height: 3, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebarFooter">
          <div className="miniCard">
            <BusinessSelectorWidget onOpenDetails={(id) => setBizModalId(id)} />
          </div>
        </div>
      </aside>

      {/* Business Details Modal */}
      {bizModalId && (
        <BusinessDetailsModal businessId={bizModalId} onClose={() => setBizModalId(null)} />
      )}

      {/* Help Modal */}
      <HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />

      {/* ── Main ─────────────────────────────────────── */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="searchWrap">
            <span className="searchIcon"><SearchIcon /></span>
            <input
              className="searchInput"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={onSearchEnter}
              placeholder={page.placeholder}
            />
          </div>

          <div className="topbarRight">
            <button className="iconBtn" title="Notifications"><BellIcon /></button>
            {pathname.startsWith("/dashboard") && (
              <button 
                className="iconBtn" 
                title="Help"
                onClick={() => setHelpModalOpen(true)}
              >
                <HelpIcon />
              </button>
            )}
            <button
              className="iconBtn"
              title="Settings"
              onClick={() => navigate("/settings")}
              style={pathname.startsWith("/settings") ? { color: "var(--accent)", background: "rgba(124,58,237,0.12)" } : {}}
            >
              <SettingsIcon />
            </button>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 6,
                padding: "5px 10px",
                color: "#f87171",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Sign out
            </button>
            <div className="profile">
              <div>
                <div className="profileName">{user?.name || user?.email?.split("@")[0] || "User"}</div>
                <div className="profileRole">
                  {pathname.startsWith("/conversations/") ? "Super Admin"
                    : pathname.startsWith("/dashboard") ? "Admin"
                      : "Admin Profile"}
                </div>
              </div>
              <div className="avatar">
                {user?.name ? user.name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase() : "AU"}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* Page header (not on detail page) */}
          {page.showHeader && (
            <div className="pageHeader">
              <div>
                {isDashboard && (
                  <span className="pill pill-success">
                    <span className="dot dot-green" style={{ width: 6, height: 6 }} />
                    System Active
                  </span>
                )}
                {page.title === "Team Performance" && (
                  <span className="pill pill-success" style={{ marginBottom: 8, display: "inline-flex" }}>
                    LIVE
                  </span>
                )}
                <h1 className="pageTitle">{page.title}</h1>
                {page.sub && <div className="pageSub">{page.sub}</div>}
              </div>

              <div className="pageHeaderActions">
                {page.actions === "dashboard" && (
                  <>
                    <button 
                      className="btn btn-ghost"
                      onClick={handleExportReport}
                      disabled={exportLoading}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      {exportLoading ? "Exporting..." : "Export Report"}
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setCampaignModalOpen(true)}
                    >
                      ⚡ New Campaign
                    </button>
                  </>
                )}
                {page.actions === "agents" && (
                  <button className="btn btn-primary">+ Create New Agent</button>
                )}
                {page.actions === "analytics" && (
                  <button className="btn btn-primary">+ New Agent</button>
                )}
              </div>
            </div>
          )}

          <Outlet />

          {/* Campaign Creation Modal */}
          {campaignModalOpen && (
            <div style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", 
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 2000
            }} onClick={() => setCampaignModalOpen(false)}>
              <div style={{
                background: "var(--bg)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16, padding: 32, maxWidth: 500, width: "90%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
              }} onClick={e => e.stopPropagation()}>
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Create New Campaign</h2>
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
                  Start a new marketing campaign to reach and engage your customers.
                </p>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--muted)", marginBottom: 8 }}>
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Summer Promo 2026"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                      color: "var(--text)", fontSize: 14, fontFamily: "inherit",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--muted)", marginBottom: 8 }}>
                    Campaign Type
                  </label>
                  <select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value)}
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                      color: "var(--text)", fontSize: 14, fontFamily: "inherit",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="lead-gen">Lead Generation</option>
                    <option value="nurture">Lead Nurture</option>
                    <option value="sales">Sales Outreach</option>
                    <option value="retention">Customer Retention</option>
                    <option value="survey">Survey/Feedback</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setCampaignModalOpen(false)}
                    style={{
                      flex: 1, padding: "12px 20px", borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                      color: "var(--text)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCampaign}
                    disabled={!campaignName.trim()}
                    style={{
                      flex: 1, padding: "12px 20px", borderRadius: 8,
                      background: "var(--accent)", border: "none",
                      color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      opacity: !campaignName.trim() ? 0.5 : 1,
                      transition: "all 0.2s ease"
                    }}
                  >
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="appFooter">
            {page.footerRight ? (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{page.footerText}</span>
                <span>
                  POWERED BY <span className="appFooterAccent">ORION</span> ENGINE V2.4.0
                </span>
              </div>
            ) : (
              <span>
                POWERED BY <span className="appFooterAccent">ORION</span> ENGINE V2.4.0
              </span>
            )}
          </footer>
        </div>
      </main>
    </div>
  );
}