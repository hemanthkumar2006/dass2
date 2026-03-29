import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { API_BASE } from "../api/client";

const AuthContext = createContext(null);

/**
 * Provides JWT auth state to the entire React tree.
 * Persists token in localStorage under "aura_token".
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("aura_token"));
    const [loading, setLoading] = useState(true);

    // Restore session on mount using the stored token
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    // Token invalid or expired — clear it
                    localStorage.removeItem("aura_token");
                    setToken(null);
                }
            })
            .catch(() => {
                localStorage.removeItem("aura_token");
                setToken(null);
            })
            .finally(() => setLoading(false));
    }, []); // only once on mount

    const _saveToken = (newToken, userData) => {
        localStorage.setItem("aura_token", newToken);
        setToken(newToken);
        setUser(userData);
    };



    /** Login with email + password */
    const login = useCallback(async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Login failed");
        _saveToken(data.token, data.user);
        return data.user;
    }, []);

    /** Signup with email + password + optional name */
    const signup = useCallback(async (email, password, name) => {
        const res = await fetch(`${API_BASE}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!data.success) {
            // Show detailed validation errors if available
            if (data.errors && data.errors.length > 0) {
                throw new Error(data.errors.map(e => e.message).join('. '));
            }
            throw new Error(data.message || "Signup failed");
        }
        _saveToken(data.token, data.user);
        return data.user;
    }, []);

    /** Google OAuth — pass the credential JWT from Google Identity Services */
    const googleAuth = useCallback(async (credential) => {
        const res = await fetch(`${API_BASE}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Google auth failed");
        _saveToken(data.token, data.user);
        return data.user;
    }, []);

    /** Logout — clear token and user */
    const logout = useCallback(() => {
        localStorage.removeItem("aura_token");
        setToken(null);
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, googleAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
