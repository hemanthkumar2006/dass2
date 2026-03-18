import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const INDUSTRIES = [
    "SaaS / Software", "E-Commerce", "Healthcare", "Finance & Banking",
    "Education", "Real Estate", "Marketing Agency", "Logistics", "Hospitality", "Other",
];

export default function SignupPage() {
    const { signup, googleAuth, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [industry, setIndustry] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const googleBtnRef = useRef(null);

    useEffect(() => {
        if (user) navigate("/dashboard", { replace: true });
    }, [user, navigate]);

    // Initialize Google Identity Services
    useEffect(() => {
        if (user) return; // Don't init if already logged in
        const initGoogle = () => {
            if (window.google?.accounts?.id && googleBtnRef.current) {
                window.google.accounts.id.initialize({
                    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                    callback: handleGoogleResponse,
                });
                window.google.accounts.id.renderButton(googleBtnRef.current, {
                    theme: "filled_black",
                    size: "large",
                    width: googleBtnRef.current.offsetWidth || 400,
                    text: "continue_with",
                    shape: "pill",
                });
            }
        };
        // If GSI script already loaded
        if (window.google?.accounts?.id) {
            initGoogle();
        } else {
            // Wait for GSI script to load
            const interval = setInterval(() => {
                if (window.google?.accounts?.id) {
                    clearInterval(interval);
                    initGoogle();
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleGoogleResponse = async (response) => {
        setError("");
        setLoading(true);
        try {
            await googleAuth(response.credential);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
        setLoading(true);
        try {
            await signup(email, password, undefined);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={s.page}>
            {/* ── Left panel ── */}
            <div style={s.left}>
                {/* Brand — links to landing page */}
                <Link to="/" style={{ ...s.brand, textDecoration: "none" }}>
                    <div style={s.brandIcon}>✦</div>
                    <span style={s.brandName}>AURA</span>
                </Link>

                <div style={s.leftContent}>
                    <h1 style={s.headline}>Design the future<br />with AURA</h1>
                    <p style={s.desc}>
                        Experience the power of production-ready AI with our glassmorphic
                        interface and deep violet aesthetics.
                    </p>

                    <div style={s.imgWrap}>
                        <img src="/hero-mountain.png" alt="AURA landscape" style={s.img} />
                    </div>

                    <div style={s.social}>
                        <div style={s.avatars}>
                            {["#a78bfa", "#7c3aed", "#5b21b6"].map((c, i) => (
                                <div key={i} style={{ ...s.avatar, background: c, marginLeft: i ? -8 : 0 }}>
                                    {["A", "J", "K"][i]}
                                </div>
                            ))}
                        </div>
                        <span style={s.socialText}>Joined by 10k+ producers this month</span>
                    </div>
                </div>
            </div>

            {/* ── Right panel ── */}
            <div style={s.right}>
                <div style={s.form}>
                    <h2 style={s.formTitle}>Create your account</h2>
                    <p style={s.formSub}>Join the next generation of AI-driven production.</p>

                    {error && <div style={s.err}>⚠ {error}</div>}

                    {/* Google Sign-In button rendered by GSI */}
                    <div ref={googleBtnRef} style={{ marginBottom: 20, minHeight: 44 }} />

                    {/* Divider */}
                    <div style={s.divider}>
                        <div style={s.divLine} /><span style={s.divText}>OR CONTINUE WITH DETAILS</span><div style={s.divLine} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={s.label}>Email Address</label>
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="name@company.com" required style={s.input} disabled={loading}
                            />
                        </div>

                        <div>
                            <label style={s.label}>Business Industry</label>
                            <div style={{ position: "relative" }}>
                                <select
                                    value={industry}
                                    onChange={e => setIndustry(e.target.value)}
                                    style={{ ...s.input, appearance: "none", WebkitAppearance: "none", cursor: "pointer", paddingRight: 36 }}
                                >
                                    <option value="" disabled>Select your industry</option>
                                    {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                                </select>
                                <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none" }}>▾</span>
                            </div>
                        </div>

                        <div>
                            <label style={s.label}>Password</label>
                            <input
                                type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="Min. 8 characters" required style={s.input} disabled={loading}
                            />
                        </div>

                        <button type="submit" style={{ ...s.submit, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                            {loading ? "Creating account…" : "Get Started"}
                        </button>
                    </form>

                    <p style={s.footer}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}>Sign In</Link>
                    </p>
                    <div style={s.tos}>
                        <a href="#" style={s.tosLink}>Terms of Service</a>
                        <a href="#" style={s.tosLink}>Privacy Policy</a>
                    </div>
                </div>
            </div>

            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        html, body, #root { height: 100%; margin: 0; padding: 0; }
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        input:focus, select:focus { outline:none; border-color:#7c3aed !important; box-shadow:0 0 0 3px rgba(124,58,237,0.2) !important; }
        input::placeholder { color:#4b5563; }
        select option { background:#1a0a3d; color:#f1f5f9; }
      `}</style>
        </div>
    );
}

const s = {
    page: { display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter', sans-serif", background: "#0f0a1e" },
    left: {
        width: "42%", height: "100vh",
        background: "linear-gradient(160deg,#1a0a3d 0%,#2d0f5a 40%,#1a0a3d 100%)",
        padding: "40px 44px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
    },
    brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 },
    brandIcon: {
        width: 34, height: 34, background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
        borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, color: "#fff", boxShadow: "0 0 20px rgba(124,58,237,0.5)",
    },
    brandName: { fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: 1 },
    leftContent: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly", animation: "fadeUp 0.6s ease both" },
    headline: { fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 },
    desc: { fontSize: 14, color: "#a78bfa", lineHeight: 1.7, marginBottom: 32, maxWidth: 320 },
    imgWrap: { borderRadius: 12, overflow: "hidden", marginBottom: 32, boxShadow: "0 8px 40px rgba(0,0,0,0.5)", border: "1px solid rgba(124,58,237,0.2)" },
    img: { width: "100%", height: 200, objectFit: "cover", display: "block" },
    social: { display: "flex", alignItems: "center", gap: 12 },
    avatars: { display: "flex", alignItems: "center" },
    avatar: { width: 32, height: 32, borderRadius: "50%", border: "2px solid #1a0a3d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" },
    socialText: { fontSize: 12, color: "#a78bfa" },
    right: { flex: 1, background: "#0d0d1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 60px" },
    form: { width: "100%", maxWidth: 400, animation: "fadeUp 0.6s ease 0.1s both" },
    formTitle: { fontSize: 28, fontWeight: 800, color: "#f1f5f9", marginBottom: 6, letterSpacing: -0.3 },
    formSub: { fontSize: 13, color: "#6b7280", marginBottom: 28 },
    err: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 },
    googleBtn: {
        width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 10, padding: "12px 0", color: "#e2e8f0", fontSize: 14, fontWeight: 500,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "inherit", marginBottom: 20,
    },
    divider: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
    divLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.08)" },
    divText: { fontSize: 10, color: "#4b5563", letterSpacing: 1, whiteSpace: "nowrap" },
    label: { display: "block", fontSize: 12, fontWeight: 600, color: "#cbd5e1", marginBottom: 7, letterSpacing: 0.2 },
    input: {
        width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "11px 14px", color: "#f1f5f9", fontSize: 14, fontFamily: "inherit",
        transition: "border-color 0.2s, box-shadow 0.2s",
    },
    submit: {
        width: "100%", background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none",
        borderRadius: 10, padding: "13px 0", color: "#fff", fontSize: 15, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 24px rgba(124,58,237,0.45)",
        letterSpacing: 0.3, marginTop: 4,
    },
    footer: { fontSize: 13, color: "#6b7280", textAlign: "center", marginTop: 24 },
    tos: { display: "flex", justifyContent: "center", gap: 20, marginTop: 12 },
    tosLink: { fontSize: 11, color: "#4b5563", textDecoration: "none" },
};
