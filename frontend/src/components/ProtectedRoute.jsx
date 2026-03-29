import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Wraps protected routes. Redirects to /login if user is not authenticated.
 * Redirects to /onboarding if user has not completed onboarding.
 * Shows nothing while auth state is loading.
 */
export default function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                background: "var(--bg, #0a0a0f)",
                color: "var(--muted, #6b7280)",
                fontSize: 14,
                fontFamily: "Inter, sans-serif",
            }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        border: "3px solid rgba(139,92,246,0.3)",
                        borderTopColor: "#8b5cf6",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 12px",
                    }} />
                    <div style={{ letterSpacing: 2, fontSize: 11, textTransform: "uppercase" }}>Loading Orion…</div>
                </div>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        );
    }

    if (!user) return <Navigate to="/" replace />;

    // Redirect to onboarding if not completed (unless already on the onboarding page)
    if (!user.onboardingCompleted && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
}

