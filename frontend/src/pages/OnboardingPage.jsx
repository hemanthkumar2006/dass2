import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { API_BASE, getAuthHeader } from "../api/client";

export default function OnboardingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [websiteUrl, setWebsiteUrl] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/onboarding`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...getAuthHeader() },
                body: JSON.stringify({ name, companyName, websiteUrl, phoneNumber }),
            });
            const data = await res.json();
            if (!data.success) {
                if (data.errors && data.errors.length > 0) {
                    throw new Error(data.errors.map(e => e.message).join('. '));
                }
                throw new Error(data.message || "Onboarding failed");
            }
            // Force a page reload to refresh user state with onboardingCompleted = true
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/auth/onboarding/skip`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...getAuthHeader() },
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message || "Failed to skip onboarding");
            window.location.href = "/dashboard";
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={s.page}>
            {/* Background glow effects */}
            <div style={s.glowTop} />
            <div style={s.glowBottom} />

            <div style={s.container}>
                {/* Brand */}
                <Link to="/" style={{ ...s.brand, textDecoration: "none" }}>
                    <div style={s.brandIcon}>✦</div>
                    <span style={s.brandName}>AURA</span>
                </Link>

                {/* Card */}
                <div style={s.card}>
                    {/* Progress indicator */}
                    <div style={s.progressWrap}>
                        <div style={s.progressBar}>
                            <div style={s.progressFill} />
                        </div>
                        <span style={s.progressText}>Step 2 of 2</span>
                    </div>

                    <div style={s.heading}>
                        <h1 style={s.title}>Almost There! 🎉</h1>
                        <p style={s.subtitle}>
                            Welcome! Let's set up your AI assistant.
                        </p>
                    </div>

                    {error && <div style={s.err}>⚠ {error}</div>}

                    <form onSubmit={handleSubmit} style={s.form}>
                        <div>
                            <label style={s.label}>
                                What should we call you?
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Your name"
                                style={s.input}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label style={s.label}>
                                Company Name <span style={s.optional}>(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                placeholder="Your company name"
                                style={s.input}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label style={s.label}>
                                Website URL <span style={s.optional}>(optional)</span>
                            </label>
                            <input
                                type="url"
                                value={websiteUrl}
                                onChange={e => setWebsiteUrl(e.target.value)}
                                placeholder="https://yourwebsite.com"
                                style={s.input}
                                disabled={loading}
                            />
                            <p style={s.hint}>
                                Enter your website URL to train your AI assistant with your business information. You can always add this later.
                            </p>
                        </div>

                        <div>
                            <label style={s.label}>
                                Phone Number <span style={s.optional}>(optional)</span>
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                placeholder="Your business phone"
                                style={s.input}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
                            disabled={loading}
                        >
                            {loading ? "Setting up…" : "Create My AI Assistant 🚀"}
                        </button>
                    </form>

                    <button
                        type="button"
                        onClick={handleSkip}
                        style={s.skipBtn}
                        disabled={loading}
                    >
                        Skip for now →
                    </button>
                </div>

                {/* Footer */}
                <p style={s.footer}>
                    You can update these details anytime from your dashboard settings.
                </p>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                html, body, #root { height: 100%; margin: 0; padding: 0; }
                * { box-sizing: border-box; }
                @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                input:focus { outline:none; border-color:#7c3aed !important; box-shadow:0 0 0 3px rgba(124,58,237,0.2) !important; }
                input::placeholder { color:#4b5563; }
            `}</style>
        </div>
    );
}

const s = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f0a1e 0%, #1a0a3d 50%, #0a0512 100%)",
        fontFamily: "'Inter', -apple-system, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
    },
    glowTop: {
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
        top: "-10%",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
    },
    glowBottom: {
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)",
        bottom: "-5%",
        right: "10%",
        pointerEvents: "none",
    },
    container: {
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        animation: "fadeUp 0.6s ease both",
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 32,
    },
    brandIcon: {
        width: 34,
        height: 34,
        background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        color: "#fff",
        boxShadow: "0 0 20px rgba(124,58,237,0.5)",
    },
    brandName: {
        fontSize: 18,
        fontWeight: 700,
        color: "#fff",
        letterSpacing: 1,
    },
    card: {
        width: "100%",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(124, 58, 237, 0.2)",
        borderRadius: 20,
        padding: "36px 32px",
        backdropFilter: "blur(20px)",
    },
    progressWrap: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 28,
    },
    progressBar: {
        flex: 1,
        height: 4,
        background: "rgba(124, 58, 237, 0.15)",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        width: "100%",
        height: "100%",
        background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
        borderRadius: 4,
    },
    progressText: {
        fontSize: 11,
        color: "#a78bfa",
        letterSpacing: 1,
        fontWeight: 600,
        whiteSpace: "nowrap",
    },
    heading: {
        textAlign: "center",
        marginBottom: 28,
    },
    title: {
        fontSize: 28,
        fontWeight: 800,
        color: "#f1f5f9",
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 14,
        color: "#94a3b8",
        lineHeight: 1.6,
    },
    nameHighlight: {
        color: "#a78bfa",
        fontWeight: 600,
    },
    err: {
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
        color: "#f87171",
        marginBottom: 16,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 18,
    },
    label: {
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: "#cbd5e1",
        marginBottom: 7,
        letterSpacing: 0.2,
    },
    optional: {
        fontWeight: 400,
        color: "#4b5563",
    },
    input: {
        width: "100%",
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 8,
        padding: "11px 14px",
        color: "#f1f5f9",
        fontSize: 14,
        fontFamily: "inherit",
        transition: "border-color 0.2s, box-shadow 0.2s",
    },
    hint: {
        fontSize: 11,
        color: "#4b5563",
        marginTop: 6,
        lineHeight: 1.5,
    },
    submitBtn: {
        width: "100%",
        background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
        border: "none",
        borderRadius: 10,
        padding: "13px 0",
        color: "#fff",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: "0 4px 24px rgba(124,58,237,0.45)",
        letterSpacing: 0.3,
        marginTop: 8,
        transition: "opacity 0.2s",
    },
    skipBtn: {
        display: "block",
        width: "100%",
        background: "none",
        border: "none",
        color: "#6b7280",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
        padding: "14px 0 0",
        textAlign: "center",
        transition: "color 0.2s",
    },
    footer: {
        fontSize: 12,
        color: "#374151",
        textAlign: "center",
        marginTop: 24,
    },
};
