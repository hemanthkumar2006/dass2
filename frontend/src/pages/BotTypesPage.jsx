import { useState } from "react";

const botTypes = [
  {
    id: "sales-agent",
    name: "Sales Agent",
    icon: "💼",
    description: "AI agent specialized in lead qualification, follow-ups, and closing deals",
    capabilities: ["Lead qualification", "Product recommendations", "Objection handling", "Deal closing"],
    example: "Engages with prospects on WhatsApp, qualifies leads, and schedules sales calls"
  },
  {
    id: "marketing-agent",
    name: "Marketing Agent",
    icon: "📢",
    description: "Focused on customer engagement, promotion, and campaign management",
    capabilities: ["Campaign promotion", "Customer segmentation", "Personalized messaging", "Engagement tracking"],
    example: "Sends targeted promotions and tracks customer interests through conversations"
  },
  {
    id: "support-agent",
    name: "Support Agent",
    icon: "🎧",
    description: "Customer service specialist handling inquiries and troubleshooting",
    capabilities: ["Ticket creation", "FAQ resolution", "Escalation routing", "Issue tracking"],
    example: "Resolves common customer issues and escalates complex problems to human agents"
  },
  {
    id: "lead-generation",
    name: "Lead Generation Bot",
    icon: "🎯",
    description: "Specialized in identifying and capturing qualified leads",
    capabilities: ["Lead discovery", "Qualification scoring", "Data enrichment", "Pipeline management"],
    example: "Identifies and qualifies potential customers from conversations and ads"
  },
  {
    id: "hr-agent",
    name: "HR Agent",
    icon: "👥",
    description: "Human Resources focused on recruitment, onboarding, and employee queries",
    capabilities: ["Candidate screening", "Interview scheduling", "Onboarding assistance", "Policy queries"],
    example: "Screens job applicants and provides onboarding information to new employees"
  },
  {
    id: "custom-bot",
    name: "Custom Bot",
    icon: "🔧",
    description: "Build your own specialized bot with custom training and workflows",
    capabilities: ["Custom training", "Workflow automation", "API integrations", "Advanced logic"],
    example: "Create a bot tailored to your specific business needs and workflows"
  }
];

export default function BotTypesPage() {
  const [selectedBot, setSelectedBot] = useState(null);
  const [bots, setBots] = useState(botTypes.map(b => ({ ...b, created: false })));

  const handleCreate = (id) => {
    setBots(prev =>
      prev.map(b =>
        b.id === id
          ? { ...b, created: !b.created }
          : b
      )
    );
  };

  const styles = {
    page: {
      padding: "0 0 40px",
      maxWidth: 1200
    },
    header: {
      marginBottom: 32
    },
    title: {
      fontSize: 28,
      fontWeight: 800,
      color: "var(--fg)",
      marginBottom: 8
    },
    subtitle: {
      fontSize: 14,
      color: "var(--muted)",
      lineHeight: 1.6
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
      gap: 20,
      marginBottom: 32
    },
    card: {
      background: "var(--surface2)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "24px",
      transition: "all 0.2s ease",
      cursor: "pointer"
    },
    cardHover: {
      borderColor: "var(--accent)",
      background: "rgba(124,58,237,0.05)",
      transform: "translateY(-2px)"
    },
    icon: {
      fontSize: 36,
      marginBottom: 12
    },
    botName: {
      fontSize: 16,
      fontWeight: 700,
      color: "var(--fg)",
      marginBottom: 6
    },
    botDesc: {
      fontSize: 13,
      color: "var(--muted)",
      marginBottom: 14,
      lineHeight: 1.5
    },
    section: {
      marginBottom: 14
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: 700,
      color: "var(--accent)",
      textTransform: "uppercase",
      marginBottom: 6,
      letterSpacing: 0.5
    },
    capabilities: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      marginBottom: 14
    },
    capabilityItem: {
      fontSize: 12,
      color: "var(--muted)",
      display: "flex",
      alignItems: "center",
      gap: 6
    },
    example: {
      fontSize: 12,
      color: "var(--muted)",
      background: "rgba(124,58,237,0.08)",
      border: "1px solid rgba(124,58,237,0.15)",
      borderRadius: 8,
      padding: "10px 12px",
      lineHeight: 1.5,
      fontStyle: "italic"
    },
    button: {
      width: "100%",
      padding: "10px",
      border: "1px solid var(--border)",
      borderRadius: 8,
      background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
      color: "#fff",
      cursor: "pointer",
      fontSize: 13,
      fontWeight: 700,
      transition: "all 0.2s ease",
      marginTop: 14
    },
    buttonCreated: {
      background: "rgba(34,197,94,0.15)",
      color: "#22c55e",
      borderColor: "rgba(34,197,94,0.2)"
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Bot Types</h1>
        <p style={styles.subtitle}>
          Choose from specialized AI bot types tailored for different business needs, or create a custom bot.
        </p>
      </div>

      <div style={styles.grid}>
        {bots.map((bot) => (
          <div
            key={bot.id}
            style={{
              ...styles.card,
              ...(selectedBot?.id === bot.id ? styles.cardHover : {})
            }}
            onMouseEnter={() => setSelectedBot(bot)}
            onMouseLeave={() => setSelectedBot(null)}
          >
            <div style={styles.icon}>{bot.icon}</div>
            <div style={styles.botName}>{bot.name}</div>
            <div style={styles.botDesc}>{bot.description}</div>

            <div style={styles.section}>
              <div style={styles.sectionLabel}>Capabilities</div>
              <div style={styles.capabilities}>
                {bot.capabilities.map((cap, idx) => (
                  <div key={idx} style={styles.capabilityItem}>
                    <span>✓</span>
                    {cap}
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.section}>
              <div style={styles.sectionLabel}>Example</div>
              <div style={styles.example}>{bot.example}</div>
            </div>

            <button
              style={{
                ...styles.button,
                ...(bot.created ? styles.buttonCreated : {})
              }}
              onClick={() => handleCreate(bot.id)}
            >
              {bot.created ? "✓ Bot Created" : "+ Create Bot"}
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: 12, padding: "20px", marginTop: 32 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
          🚀 Getting Started
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          Select a bot type that matches your business needs. Each bot comes pre-configured with relevant capabilities. You can further customize the bot's personality, knowledge base, and responses in the Agent Management section.
        </div>
      </div>
    </div>
  );
}
