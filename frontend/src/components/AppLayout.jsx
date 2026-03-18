import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useBusiness } from "../api/businessContext";
import { useAuth } from "../contexts/AuthContext";
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

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: DashIcon },
  { label: "Conversations", to: "/conversations", icon: ConvIcon },
  { label: "Analytics", to: "/analytics", icon: AnalyticsIcon },
  { label: "Agent Management", to: "/agents", icon: AgentsIcon },
];

/* ── page-level metadata ──────────────────────────────────── */
function usePage(pathname) {
  return useMemo(() => {
    if (pathname.startsWith("/conversations/")) return {
      title: null, // rendered inside the page
      sub: null,
      actions: null,
      footerText: "AGENT AURA-V2-04 · US-WEST-2",
      footerRight: "AURA · PROJECT VIOLET V2.4.0",
      showHeader: false,
      placeholder: "Search conversations…",
    };
    if (pathname === "/conversations") return {
      title: "Conversations",
      sub: "Browse WhatsApp chats and open the full transcript",
      actions: null,
      footerText: "POWERED BY AURA ENGINE V2.4.0 · PROJECT VIOLET",
      footerRight: null,
      showHeader: true,
      placeholder: "Search conversations…",
    };
    if (pathname.startsWith("/analytics")) return {
      title: "Team Performance",
      sub: null,
      actions: "analytics",
      footerText: "POWERED BY AURA ENGINE V2.4.0 · PROJECT VIOLET",
      footerRight: null,
      showHeader: true,
      placeholder: "Search across agents and conversations…",
    };
    if (pathname.startsWith("/agents")) return {
      title: "AI Agents",
      sub: "Deploy and manage your specialized autonomous sales fleet.",
      actions: "agents",
      footerText: "FLEET MANAGEMENT · PROJECT VIOLET · CLUSTER US-WEST-2",
      footerRight: "POWERED BY AURA ENGINE V2.4.0",
      showHeader: true,
      placeholder: "Search agents, nodes, or metrics…",
    };

    // dashboard
    return {
      title: "Sales Command Center",
      sub: "Real-time autonomous WhatsApp agent monitoring",
      actions: "dashboard",
      footerText: "POWERED BY AURA ENGINE V2.4.0 · PROJECT VIOLET",
      footerRight: null,
      showHeader: true,
      placeholder: "Search leads, transcripts or analytics…",
    };
  }, [pathname]);
}

/* ── Business Selector Widget (sidebar footer) ───────────────── */
function BusinessSelectorWidget() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <span className="dot dot-green" />
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{businesses[0].name}</span>
        </div>
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
    </div>
  );
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const page = usePage(pathname);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const onSearchEnter = (e) => {
    if (e.key !== "Enter") return;
    if (pathname.startsWith("/conversations"))
      navigate(`/conversations?q=${encodeURIComponent(q)}`);
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
            <div className="brandName">AURA <span style={{ color: "var(--accent)" }}>AI</span></div>
            <div className="brandSub">Autonomous</div>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((it) => {
            const Icon = it.icon;
            return (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) => "navItem " + (isActive ? "active" : "")}
                end={it.to === "/dashboard"}
              >
                <Icon />
                <span>{it.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebarFooter">
          <div className="miniCard">
            <BusinessSelectorWidget />
          </div>
        </div>
      </aside>

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
              <button className="iconBtn" title="Help"><HelpIcon /></button>
            )}
            {!pathname.startsWith("/dashboard") && (
              <button className="iconBtn" title="Settings"><SettingsIcon /></button>
            )}
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
                  <div className="statusRow">
                    <span className="projectLabel">PROJECT VIOLET</span>
                    <span className="pill pill-success">
                      <span className="dot dot-green" style={{ width: 6, height: 6 }} />
                      System Active
                    </span>
                  </div>
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
                    <button className="btn btn-ghost">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export Report
                    </button>
                    <button className="btn btn-primary">
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

          {/* Footer */}
          <footer className="appFooter">
            {page.footerRight ? (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{page.footerText}</span>
                <span>
                  POWERED BY <span className="appFooterAccent">AURA</span> ENGINE V2.4.0
                </span>
              </div>
            ) : (
              <span>
                POWERED BY <span className="appFooterAccent">AURA</span> ENGINE V2.4.0 · PROJECT VIOLET
              </span>
            )}
          </footer>
        </div>
      </main>
    </div>
  );
}