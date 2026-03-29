import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useBusiness } from "../api/businessContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

/* ── Icons ───────────────────────────────────────────────────── */
const UserIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);
const BuildingIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);
const BellIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);
const ShieldIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const PaletteIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13" cy="13" r="8" />
        <path d="M5 9a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
        <path d="M15 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
        <path d="M7 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
        <path d="M17 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
    </svg>
);

/* ── Shared styles ───────────────────────────────────────────── */
const s = {
    page: { padding: "0 0 40px 0", maxWidth: 860, fontFamily: "inherit" },
    layout: { display: "grid", gridTemplateColumns: "220px 1fr", gap: 24, marginTop: 8 },
    menu: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", height: "fit-content" },
    menuItem: {
        display: "flex", alignItems: "center", gap: 10, padding: "13px 18px",
        fontSize: 13.5, fontWeight: 500, cursor: "pointer", border: "none",
        width: "100%", textAlign: "left", fontFamily: "inherit", transition: "background 0.15s",
        borderBottom: "1px solid var(--border)",
    },
    card: { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "28px 32px" },
    sectionTitle: { fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 4 },
    sectionSub: { fontSize: 13, color: "var(--muted)", marginBottom: 28, lineHeight: 1.5 },
    label: { fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.3 },
    input: {
        width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "10px 14px", color: "var(--fg)", fontSize: 13.5,
        fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
    },
    inputDisabled: {
        width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8, padding: "10px 14px", color: "var(--muted)", fontSize: 13.5,
        fontFamily: "inherit", outline: "none", boxSizing: "border-box", cursor: "not-allowed",
    },
    textarea: {
        width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "10px 14px", color: "var(--fg)", fontSize: 13.5,
        fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical",
        minHeight: 80, transition: "border-color 0.2s",
    },
    row: { marginBottom: 20 },
    divider: { borderTop: "1px solid var(--border)", margin: "24px 0" },
    btnPrimary: {
        background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: 8,
        padding: "10px 22px", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer",
        fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 7, transition: "opacity 0.2s",
    },
    btnDanger: {
        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8,
        padding: "10px 22px", color: "#f87171", fontSize: 13, fontWeight: 700, cursor: "pointer",
        fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 7,
    },
    toggle: { position: "relative", width: 42, height: 24, display: "inline-block", flexShrink: 0 },
    toggleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)" },
    toggleLabel: { fontSize: 13.5, fontWeight: 500, color: "var(--fg)" },
    toggleSub: { fontSize: 12, color: "var(--muted)", marginTop: 2 },
    badge: {
        display: "inline-block", background: "rgba(124,58,237,0.15)", color: "var(--accent)",
        borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 0.3,
    },
    infoRow: {
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "13px 0", borderBottom: "1px solid var(--border)",
    },
    infoLabel: { fontSize: 12, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 },
    infoValue: { fontSize: 13, color: "var(--fg)", fontWeight: 500, fontFamily: "monospace", wordBreak: "break-all", maxWidth: "60%", textAlign: "right" },
};

/* ── Toggle component ────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
    return (
        <label style={s.toggle}>
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
                style={{ opacity: 0, width: 0, height: 0, position: "absolute" }} />
            <span style={{
                position: "absolute", inset: 0, borderRadius: 12,
                background: checked ? "var(--accent)" : "rgba(255,255,255,0.12)",
                transition: "background 0.2s", cursor: "pointer",
            }} />
            <span style={{
                position: "absolute", width: 18, height: 18, borderRadius: "50%", background: "#fff",
                top: 3, left: checked ? 21 : 3, transition: "left 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.4)",
            }} />
        </label>
    );
}

/* ── Toast ───────────────────────────────────────────────────── */
function Toast({ msg, type }) {
    if (!msg) return null;
    return (
        <div style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 9999,
            background: type === "error" ? "rgba(239,68,68,0.15)" : "rgba(74,222,128,0.15)",
            border: `1px solid ${type === "error" ? "rgba(239,68,68,0.3)" : "rgba(74,222,128,0.3)"}`,
            color: type === "error" ? "#f87171" : "#4ade80",
            borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
            {type === "error" ? "✕" : "✓"} {msg}
        </div>
    );
}

/* ── Profile Tab ─────────────────────────────────────────────── */
function ProfileTab({ user }) {
    const initials = user?.name
        ? user.name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase()
        : user?.email?.slice(0, 2).toUpperCase() || "AU";

    return (
        <div style={s.card}>
            <div style={s.sectionTitle}>Profile</div>
            <div style={s.sectionSub}>Your personal account information.</div>

            {/* Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
                <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>{initials}</div>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{user?.name || "User"}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 3 }}>{user?.email}</div>
                    <span style={s.badge}>Admin</span>
                </div>
            </div>

            <div style={s.row}>
                <label style={s.label}>Full Name</label>
                <input style={s.inputDisabled} value={user?.name || ""} readOnly title="Name is set during signup" />
            </div>
            <div style={s.row}>
                <label style={s.label}>Email Address</label>
                <input style={s.inputDisabled} value={user?.email || ""} readOnly />
            </div>
            <div style={s.row}>
                <label style={s.label}>User ID</label>
                <input style={{ ...s.inputDisabled, fontSize: 12 }} value={user?.id || ""} readOnly />
            </div>

            <div style={{ ...s.divider }} />
            <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 8, padding: "10px 14px", fontSize: 12.5, color: "#fbbf24" }}>
                ⚠️ Profile editing will be available in a future update.
            </div>
        </div>
    );
}

/* ── Business Tab ────────────────────────────────────────────── */
function BusinessTab({ businesses }) {
    const biz = businesses?.[0];
    if (!biz) return (
        <div style={s.card}>
            <div style={s.sectionTitle}>Business</div>
            <div style={{ color: "var(--muted)", fontSize: 13, marginTop: 16 }}>No business connected. Start the backend.</div>
        </div>
    );

    const fields = [
        { label: "Business Name", value: biz.name },
        { label: "Business ID", value: biz.id },
        { label: "Email", value: biz.email || "—" },
        { label: "WhatsApp Phone Number ID", value: biz.whatsapp_phone_number_id || "—" },
        { label: "Created", value: biz.created_at ? new Date(biz.created_at).toLocaleString() : "—" },
    ];

    return (
        <div style={s.card}>
            <div style={s.sectionTitle}>Business</div>
            <div style={s.sectionSub}>Details about your connected business account.</div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 8, padding: "9px 14px", width: "fit-content" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399", letterSpacing: 0.5 }}>ACTIVE</span>
            </div>

            {fields.map(f => (
                <div key={f.label} style={s.infoRow}>
                    <span style={s.infoLabel}>{f.label}</span>
                    <span style={s.infoValue}>{f.value}</span>
                </div>
            ))}
        </div>
    );
}

/* ── Notifications Tab ───────────────────────────────────────── */
function NotificationsTab() {
    const [prefs, setPrefs] = useState({
        newConversation: true,
        agentErrors: true,
        weeklyReport: false,
        systemAlerts: true,
        leadQualified: true,
    });
    const [saved, setSaved] = useState(false);

    const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const items = [
        { key: "newConversation", label: "New Conversation", sub: "Get notified when a new customer starts a chat" },
        { key: "agentErrors", label: "Agent Errors", sub: "Alert when an AI agent encounters an error" },
        { key: "leadQualified", label: "Lead Qualified", sub: "Notify when a lead is automatically qualified by the AI" },
        { key: "weeklyReport", label: "Weekly Report", sub: "Receive a summary of activity every Monday" },
        { key: "systemAlerts", label: "System Alerts", sub: "Critical system and infrastructure notifications" },
    ];

    return (
        <div style={s.card}>
            <div style={s.sectionTitle}>Notifications</div>
            <div style={s.sectionSub}>Choose which events you'd like to be notified about.</div>

            {items.map(item => (
                <div key={item.key} style={s.toggleRow}>
                    <div>
                        <div style={s.toggleLabel}>{item.label}</div>
                        <div style={s.toggleSub}>{item.sub}</div>
                    </div>
                    <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
                </div>
            ))}

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
                <button style={{ ...s.btnPrimary, opacity: saved ? 0.7 : 1 }} onClick={handleSave}>
                    {saved ? "✓ Saved!" : "Save Preferences"}
                </button>
            </div>
        </div>
    );
}

/* ── Security Tab ────────────────────────────────────────────── */
function SecurityTab({ onLogout }) {
    return (
        <div style={s.card}>
            <div style={s.sectionTitle}>Security</div>
            <div style={s.sectionSub}>Manage your account security and session.</div>

            {[
                { label: "Authentication", value: "JWT Bearer Token" },
                { label: "Session Storage", value: "localStorage" },
                { label: "Token Status", value: "Active" },
            ].map(f => (
                <div key={f.label} style={s.infoRow}>
                    <span style={s.infoLabel}>{f.label}</span>
                    <span style={{ ...s.infoValue, fontFamily: "inherit", color: f.label === "Token Status" ? "#4ade80" : "var(--fg)" }}>
                        {f.value}
                    </span>
                </div>
            ))}

            <div style={s.divider} />

            <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Sign Out</div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.6 }}>
                    This will clear your session and redirect you to the login page.
                </div>
                <button style={s.btnDanger} onClick={onLogout}>
                    Sign out of Orion
                </button>
            </div>
        </div>
    );
}

/* ── Appearance Tab ──────────────────────────────────────────── */
function AppearanceTab() {
    const { theme, setTheme } = useTheme();
    
    const modes = [
        { id: "light", label: "Light", icon: "☀️" },
        { id: "dark", label: "Dark", icon: "🌙" },
    ];

    return (
        <div style={s.card}>
            <div style={s.sectionTitle}>Appearance</div>
            <div style={s.sectionSub}>Choose how Orion looks on your device.</div>

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                {modes.map(mode => (
                    <button
                        key={mode.id}
                        onClick={() => setTheme(mode.id)}
                        style={{
                            flex: 1,
                            padding: "16px 20px",
                            borderRadius: 12,
                            border: theme === mode.id ? "2px solid var(--accent)" : "1px solid var(--border)",
                            background: theme === mode.id ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)",
                            color: "var(--fg)",
                            cursor: "pointer",
                            fontSize: 14,
                            fontWeight: 600,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 0.2s ease",
                        }}
                    >
                        <span style={{ fontSize: 24 }}>{mode.icon}</span>
                        {mode.label}
                    </button>
                ))}
            </div>

            <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 8, padding: "12px 14px", fontSize: 12.5, color: "var(--muted)" }}>
                ℹ️ Your theme preference is saved automatically and will be applied across all your sessions.
            </div>
        </div>
    );
}

/* ── Main Page ───────────────────────────────────────────────── */
const TABS = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "business", label: "Business", icon: BuildingIcon },
    { id: "appearance", label: "Appearance", icon: PaletteIcon },
    { id: "notifications", label: "Notifications", icon: BellIcon },
    { id: "security", label: "Security", icon: ShieldIcon },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const { user, logout } = useAuth();
    const { businesses } = useBusiness();
    const navigate = useNavigate();
    const [toast, setToast] = useState({ msg: "", type: "success" });

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div style={s.page}>
            <div style={s.layout}>
                {/* Left menu */}
                <div>
                    <div style={s.menu}>
                        {TABS.map((tab, i) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            const isLast = i === TABS.length - 1;
                            return (
                                <button
                                    key={tab.id}
                                    style={{
                                        ...s.menuItem,
                                        background: isActive ? "rgba(124,58,237,0.2)" : "transparent",
                                        color: isActive ? "var(--accent)" : "var(--fg)",
                                        borderBottom: isLast ? "none" : "1px solid var(--border)",
                                    }}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon />
                                    {tab.label}
                                    {isActive && (
                                        <span style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* App version */}
                    <div style={{ marginTop: 16, padding: "0 4px", fontSize: 11, color: "var(--muted)", lineHeight: 1.8 }}>
                        <div>Orion Engine v2.4.0</div>
                    </div>
                </div>

                {/* Right panel */}
                <div>
                    {activeTab === "profile" && <ProfileTab user={user} />}
                    {activeTab === "business" && <BusinessTab businesses={businesses} />}
                    {activeTab === "appearance" && <AppearanceTab />}
                    {activeTab === "notifications" && <NotificationsTab />}
                    {activeTab === "security" && <SecurityTab onLogout={handleLogout} />}
                </div>
            </div>
            <Toast msg={toast.msg} type={toast.type} />
        </div>
    );
}
