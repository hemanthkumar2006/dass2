import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../api/client";

/* ── Fetch all landing data in one call ─────────────────────────── */
function useLandingData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/landing`)
            .then(r => r.json())
            .then(res => setData(res.data || null))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, []);

    return { data, loading };
}

/* ── Nav ──────────────────────────────────────────────────────────── */
function Nav() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            background: scrolled ? "rgba(10,8,20,0.9)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(124,58,237,0.15)" : "none",
            transition: "all 0.3s ease",
            padding: "0 60px", height: 64,
            display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#7c3aed,#5b21b6)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff" }}>✦</div>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>AURA</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Link to="/login" style={{ padding: "8px 18px", borderRadius: 8, color: "#a78bfa", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Sign in</Link>
                <Link to="/signup" style={{ padding: "9px 20px", borderRadius: 8, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>Get Started</Link>
            </div>
        </nav>
    );
}

/* ── Hero section ─────────────────────────────────────────────────── */
function Hero({ home }) {
    return (
        <section style={{
            minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", textAlign: "center", padding: "120px 40px 80px",
            background: "linear-gradient(180deg,#0f0a1e 0%,#1a0a3d 50%,#0a0512 100%)",
            position: "relative", overflow: "hidden",
        }}>
            {/* Glows */}
            <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,0.2) 0%,transparent 70%)", top: "10%", left: "50%", transform: "translateX(-50%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1, maxWidth: 780 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", borderRadius: 24, padding: "6px 16px", marginBottom: 28, fontSize: 12, color: "#a78bfa", letterSpacing: 1 }}>
                    ✦ AUTONOMOUS AI REVENUE AGENT
                </div>
                <h1 style={{ fontSize: 64, fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 24, letterSpacing: -2 }}>
                    {home?.headline || "The Future of"}<br />
                    <span style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        {home?.subheadline || "AI-Driven Revenue"}
                    </span>
                </h1>
                <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.7, marginBottom: 44, maxWidth: 560, margin: "0 auto 44px" }}>
                    {home?.tagline || "AURA automates your sales and customer engagement with production-ready AI agents that work 24/7 across WhatsApp, email, and more."}
                </p>
                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link to="/signup" style={{ padding: "14px 36px", borderRadius: 10, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", textDecoration: "none", fontSize: 16, fontWeight: 700, boxShadow: "0 8px 32px rgba(124,58,237,0.5)", letterSpacing: 0.3 }}>
                        {home?.cta_text || "Get Started Free"} →
                    </Link>
                    <a href="#services" style={{ padding: "14px 36px", borderRadius: 10, border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa", textDecoration: "none", fontSize: 16, fontWeight: 600 }}>
                        Learn More
                    </a>
                </div>

            </div>
        </section>
    );
}

/* ── Stats bar ────────────────────────────────────────────────────── */
function Stats() {
    const items = [["10k+", "Businesses powered"], ["98%", "Response accuracy"], ["24/7", "Always-on AI agents"], ["3min", "Average setup time"]];
    return (
        <div style={{ background: "rgba(124,58,237,0.08)", borderTop: "1px solid rgba(124,58,237,0.15)", borderBottom: "1px solid rgba(124,58,237,0.15)", padding: "32px 80px", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
            {items.map(([num, label]) => (
                <div key={num} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#a78bfa", letterSpacing: -1 }}>{num}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{label}</div>
                </div>
            ))}
        </div>
    );
}

/* ── Services ─────────────────────────────────────────────────────── */
function Services({ services }) {
    const defaults = [
        { title: "WhatsApp AI Agent", description: "Deploy intelligent conversational agents on WhatsApp that qualify leads, answer queries, and close deals automatically.", icon: "💬" },
        { title: "Revenue Analytics", description: "Real-time dashboards showing conversion rates, engagement metrics, and revenue attribution from every AI interaction.", icon: "📊" },
        { title: "Multi-Channel Outreach", description: "Unified AI outreach across WhatsApp, email, and SMS with personalized messaging at scale.", icon: "🚀" },
    ];
    const items = (services && services.length > 0) ? services : defaults;

    return (
        <section id="services" style={{ padding: "100px 80px", background: "#0a0512" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#7c3aed", textTransform: "uppercase", marginBottom: 14 }}>What We Offer</div>
                <h2 style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 16 }}>Built to Scale Your Revenue</h2>
                <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 520, margin: "0 auto" }}>Everything you need to turn conversations into conversions, powered by AI.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
                {items.map((s, i) => (
                    <div key={i} style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.15)",
                        borderRadius: 16, padding: "32px 28px",
                        transition: "border-color 0.2s, transform 0.2s",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)"; e.currentTarget.style.transform = "none"; }}
                    >
                        <div style={{ fontSize: 32, marginBottom: 18 }}>{s.icon || "✦"}</div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", marginBottom: 12 }}>{s.title || s.name}</h3>
                        <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{s.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ── Pricing ──────────────────────────────────────────────────────── */
function Pricing({ pricing }) {
    const defaults = [
        { name: "Starter", price: "$49", billing_period: "month", description: "Perfect for small businesses getting started with AI.", features: ["1 AI Agent", "1,000 conversations/mo", "WhatsApp integration", "Basic analytics"], is_featured: false },
        { name: "Growth", price: "$149", billing_period: "month", description: "For growing businesses that need more power.", features: ["5 AI Agents", "10,000 conversations/mo", "All channels", "Advanced analytics", "Priority support"], is_featured: true },
        { name: "Enterprise", price: "Custom", billing_period: "", description: "Unlimited power for large-scale operations.", features: ["Unlimited agents", "Unlimited conversations", "Custom integrations", "Dedicated support", "SLA guarantee"], is_featured: false },
    ];
    const plans = (pricing && pricing.length > 0) ? pricing : defaults;

    return (
        <section id="pricing" style={{ padding: "100px 80px", background: "linear-gradient(180deg,#0a0512,#0f0a1e)" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#7c3aed", textTransform: "uppercase", marginBottom: 14 }}>Pricing</div>
                <h2 style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -1, marginBottom: 16 }}>Transparent & Simple</h2>
                <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 480, margin: "0 auto" }}>No hidden fees. Scale as you grow.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
                {plans.map((plan, i) => (
                    <div key={i} style={{
                        background: plan.is_featured ? "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(109,40,217,0.15))" : "rgba(255,255,255,0.03)",
                        border: plan.is_featured ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16, padding: "36px 28px",
                        position: "relative", overflow: "hidden",
                        display: "flex", flexDirection: "column",
                    }}>
                        {plan.is_featured && <div style={{ position: "absolute", top: 16, right: 16, background: "#7c3aed", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1 }}>POPULAR</div>}
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa", marginBottom: 8 }}>{plan.name}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
                            <span style={{ fontSize: 40, fontWeight: 900, color: "#fff" }}>{plan.price || plan.monthly_price}</span>
                            {plan.billing_period && <span style={{ fontSize: 14, color: "#6b7280" }}>/{plan.billing_period}</span>}
                        </div>
                        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>{plan.description}</p>
                        <ul style={{ listStyle: "none", padding: 0, marginBottom: 28, flex: 1 }}>
                            {(Array.isArray(plan.features) ? plan.features : (plan.features ? JSON.parse(plan.features) : [])).map((f, j) => (
                                <li key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13, color: "#cbd5e1" }}>
                                    <span style={{ color: "#7c3aed", fontSize: 14 }}>✓</span>{f}
                                </li>
                            ))}
                        </ul>
                        <Link to="/signup" style={{ display: "block", textAlign: "center", padding: "11px 0", borderRadius: 8, background: plan.is_featured ? "linear-gradient(135deg,#7c3aed,#6d28d9)" : "rgba(124,58,237,0.15)", color: "#a78bfa", textDecoration: "none", fontSize: 14, fontWeight: 600, boxShadow: plan.is_featured ? "0 4px 20px rgba(124,58,237,0.4)" : "none", marginTop: "auto" }}>
                            Get Started
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ── FAQs ─────────────────────────────────────────────────────────── */
function FAQs({ faqs }) {
    const [open, setOpen] = useState(null);
    const defaults = [
        { question: "How quickly can I set up AURA?", answer: "Most businesses are up and running in under 3 minutes. Connect your WhatsApp number, configure your AI agent's personality and knowledge base, and you're live." },
        { question: "Does AURA work with existing CRM systems?", answer: "Yes, AURA integrates with popular CRMs like HubSpot, Salesforce, and Pipedrive via our API. Custom integrations are available on Enterprise plans." },
        { question: "What happens when the AI can't answer a question?", answer: "AURA intelligently escalates conversations to your human team when it detects complex queries outside its knowledge base, ensuring customers always get the right help." },
    ];
    const items = (faqs && faqs.length > 0) ? faqs : defaults;

    return (
        <section id="faq" style={{ padding: "100px 80px", background: "#0a0512" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#7c3aed", textTransform: "uppercase", marginBottom: 14 }}>FAQ</div>
                <h2 style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>Frequently Asked</h2>
            </div>
            <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map((faq, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.15)", borderRadius: 12, overflow: "hidden" }}>
                        <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left" }}>
                            <span style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>{faq.question}</span>
                            <span style={{ fontSize: 18, color: "#7c3aed", transition: "transform 0.2s", transform: open === i ? "rotate(45deg)" : "none" }}>+</span>
                        </button>
                        {open === i && (
                            <div style={{ padding: "0 24px 20px", fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>{faq.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ── Testimonials ─────────────────────────────────────────────────── */
function Testimonials({ testimonials }) {
    const defaults = [
        { author_name: "Sarah Chen", author_title: "Growth Lead @ TechFlow", content: "AURA's WhatsApp AI closed 3x more leads in the first week. Absolutely transformative for our sales pipeline.", rating: 5 },
        { author_name: "Marcus Williams", author_title: "Founder @ ShopLocal", content: "Setting up took 2 minutes. The AI handles 80% of customer queries autonomously. My team finally has time to focus on growth.", rating: 5 },
        { author_name: "Priya Patel", author_title: "Head of CX @ FinBridge", content: "The analytics dashboard alone is worth it. We finally understand where customers drop off and can fix it instantly.", rating: 5 },
    ];
    const items = (testimonials && testimonials.length > 0) ? testimonials : defaults;

    return (
        <section style={{ padding: "100px 80px", background: "linear-gradient(180deg,#0a0512,#0f0a1e)" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#7c3aed", textTransform: "uppercase", marginBottom: 14 }}>Testimonials</div>
                <h2 style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>Loved by Builders</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
                {items.map((t, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.12)", borderRadius: 16, padding: "28px 24px" }}>
                        <div style={{ fontSize: 18, color: "#7c3aed", marginBottom: 14 }}>{"★".repeat(t.rating || 5)}</div>
                        <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>"{t.content}"</p>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{t.author_name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{t.author_title || t.company}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ── CTA Banner ───────────────────────────────────────────────────── */
function CTABanner() {
    return (
        <section style={{ padding: "100px 80px", background: "linear-gradient(135deg,#1a0a3d,#2d0f5a)", textAlign: "center", borderTop: "1px solid rgba(124,58,237,0.2)" }}>
            <h2 style={{ fontSize: 52, fontWeight: 900, color: "#fff", letterSpacing: -1.5, marginBottom: 20 }}>
                Start Automating<br />
                <span style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Your Revenue Today</span>
            </h2>
            <p style={{ fontSize: 16, color: "#a78bfa", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
                Join 10,000+ businesses using AURA to turn conversations into conversions.
            </p>
            <Link to="/signup" style={{ display: "inline-block", padding: "16px 48px", borderRadius: 12, background: "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", textDecoration: "none", fontSize: 17, fontWeight: 700, boxShadow: "0 8px 40px rgba(124,58,237,0.6)", letterSpacing: 0.3 }}>
                Get Started Free →
            </Link>
        </section>
    );
}

/* ── Footer ───────────────────────────────────────────────────────── */
function Footer() {
    return (
        <footer style={{ background: "#050308", borderTop: "1px solid rgba(124,58,237,0.1)", padding: "40px 80px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 26, height: 26, background: "linear-gradient(135deg,#7c3aed,#5b21b6)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>✦</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>AURA</span>
            </div>
            <div style={{ fontSize: 12, color: "#374151" }}>© {new Date().getFullYear()} AURA. All rights reserved.</div>
            <div style={{ display: "flex", gap: 20 }}>
                {["Privacy", "Terms", "Contact"].map(l => <a key={l} href="#" style={{ fontSize: 12, color: "#4b5563", textDecoration: "none" }}>{l}</a>)}
            </div>
        </footer>
    );
}

/* ── Main LandingPage component ────────────────────────────────────── */
export default function LandingPage() {
    const { data, loading } = useLandingData();

    return (
        <div style={{ background: "#0a0512", minHeight: "100vh", fontFamily: "'Inter',-apple-system,sans-serif" }}>
            <Nav />
            {loading ? (
                <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: 14 }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ width: 36, height: 36, border: "3px solid rgba(124,58,237,0.3)", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                        Loading AURA…
                    </div>
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
            ) : (
                <>
                    <Hero home={data?.home} />
                    <Stats />
                    <Services services={data?.services} />
                    <Pricing pricing={data?.pricing} />
                    <Testimonials testimonials={data?.testimonials} />
                    <FAQs faqs={data?.faqs} />
                    <CTABanner />
                    <Footer />
                </>
            )}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
