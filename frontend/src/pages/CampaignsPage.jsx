import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useBusiness } from "../api/businessContext";

// Campaign status badge styles
function CampaignStatusBadge({ status }) {
  const colors = {
    active: { bg: "rgba(74,222,128,0.15)", text: "#4ade80", border: "rgba(74,222,128,0.3)" },
    draft: { bg: "rgba(156,163,175,0.15)", text: "#9ca3af", border: "rgba(156,163,175,0.3)" },
    scheduled: { bg: "rgba(96,165,250,0.15)", text: "#60a5fa", border: "rgba(96,165,250,0.3)" },
    completed: { bg: "rgba(168,85,247,0.15)", text: "#a855f7", border: "rgba(168,85,247,0.3)" },
    paused: { bg: "rgba(250,204,21,0.15)", text: "#fcc922", border: "rgba(250,204,21,0.3)" },
  };
  const style = colors[status] || colors.draft;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
      background: style.bg, color: style.text, border: `1px solid ${style.border}`,
      textTransform: "uppercase", letterSpacing: 0.5
    }}>
      • {status}
    </span>
  );
}

// Campaign type icon
function getCampaignIcon(type) {
  const icons = {
    "lead-gen": "🎯",
    "nurture": "🌱",
    "sales": "💰",
    "retention": "❤️",
    "survey": "📋"
  };
  return icons[type] || "📧";
}

export default function CampaignsPage() {
  const { businessId } = useBusiness();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const createNew = searchParams.get("create") === "true";
  const newCampaignName = searchParams.get("name") || "";
  const newCampaignType = searchParams.get("type") || "lead-gen";

  // Load campaigns (mock data for now)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCampaigns([
        {
          id: 1,
          name: "Q1 2026 - Lead Generation",
          type: "lead-gen",
          status: "active",
          created: "2026-01-15",
          startDate: "2026-01-15",
          endDate: "2026-03-31",
          recipients: 1250,
          engaged: 450,
          conversions: 87,
          revenue: 12500
        },
        {
          id: 2,
          name: "Summer Flash Sale",
          type: "sales",
          status: "scheduled",
          created: "2026-02-01",
          startDate: "2026-06-01",
          endDate: "2026-06-30",
          recipients: 0,
          engaged: 0,
          conversions: 0,
          revenue: 0
        },
        {
          id: 3,
          name: "Customer Retention - March",
          type: "retention",
          status: "completed",
          created: "2025-12-10",
          startDate: "2026-03-01",
          endDate: "2026-03-31",
          recipients: 890,
          engaged: 320,
          conversions: 45,
          revenue: 8950
        }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // If creating new campaign, add it to the list
  useEffect(() => {
    if (createNew && newCampaignName) {
      const newCampaign = {
        id: Date.now(),
        name: newCampaignName,
        type: newCampaignType,
        status: "draft",
        created: new Date().toISOString().split("T")[0],
        startDate: null,
        endDate: null,
        recipients: 0,
        engaged: 0,
        conversions: 0,
        revenue: 0
      };
      setCampaigns(prev => [newCampaign, ...prev]);
      // Clear the URL params
      navigate("/campaigns", { replace: true });
    }
  }, [createNew, newCampaignName, newCampaignType, navigate]);

  return (
    <div className="stack">
      {/* Campaigns Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {campaigns.map(campaign => (
          <div
            key={campaign.id}
            className="card"
            style={{
              cursor: "pointer",
              transition: "all 0.2s ease",
              border: "1px solid rgba(255,255,255,0.1)"
            }}
            onClick={() => navigate(`/campaigns/${campaign.id}`)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 14 }}>
              <div style={{ fontSize: 28 }}>{getCampaignIcon(campaign.type)}</div>
              <CampaignStatusBadge status={campaign.status} />
            </div>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--text)" }}>
              {campaign.name}
            </h3>
            <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 16 }}>
              Created {new Date(campaign.created).toLocaleDateString()}
            </p>

            {campaign.status === "draft" && (
              <div style={{
                background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.3)",
                borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12, color: "var(--text)"
              }}>
                This campaign is in draft mode. Configure and launch it to start reaching recipients.
              </div>
            )}

            {campaign.status !== "draft" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                    Recipients
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>
                    {campaign.recipients.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                    Conversions
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#4ade80" }}>
                    {campaign.conversions}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                    Engagement
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#60a5fa" }}>
                    {campaign.recipients > 0 ? Math.round((campaign.engaged / campaign.recipients) * 100) : 0}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
                    Revenue
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--accent)" }}>
                    ${campaign.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <button
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                color: "var(--accent)", fontSize: 12, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/campaigns/${campaign.id}`);
              }}
            >
              {campaign.status === "draft" ? "Configure" : "View Details"} →
            </button>
          </div>
        ))}
      </div>

      {campaigns.length === 0 && !loading && (
        <div style={{
          padding: "60px 20px", textAlign: "center", color: "var(--muted)"
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No campaigns yet</div>
          <div style={{ fontSize: 13 }}>Create your first campaign to start engaging customers</div>
        </div>
      )}
    </div>
  );
}
