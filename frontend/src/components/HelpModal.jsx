import { useEffect, useState } from "react";

const HelpModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && isOpen) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalStyle = {
    background: "var(--surface, #1a1a2e)",
    border: "1px solid var(--border, rgba(255,255,255,0.08))",
    borderRadius: 16,
    width: "90%",
    maxWidth: 700,
    maxHeight: "85vh",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px 32px",
    borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
  };

  const titleStyle = {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--fg, #e2e8f0)",
    margin: 0,
  };

  const closeButtonStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid var(--border, rgba(255,255,255,0.08))",
    borderRadius: 8,
    width: 32,
    height: 32,
    cursor: "pointer",
    color: "var(--muted, #888)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  };

  const tabsStyle = {
    display: "flex",
    gap: 0,
    borderBottom: "1px solid var(--border, rgba(255,255,255,0.08))",
    padding: "0 32px",
  };

  const tabStyle = (isActive) => ({
    padding: "14px 16px",
    borderBottom: isActive ? "2px solid var(--accent, #a78bfa)" : "2px solid transparent",
    background: "none",
    border: "none",
    color: isActive ? "var(--accent, #a78bfa)" : "var(--muted, #888)",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    transition: "all 0.2s ease",
  });

  const contentStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "24px 32px",
  };

  const sectionStyle = {
    marginBottom: 24,
  };

  const sectionTitleStyle = {
    fontSize: 14,
    fontWeight: 700,
    color: "var(--fg, #e2e8f0)",
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  };

  const contentTextStyle = {
    fontSize: 13,
    color: "var(--muted, #888)",
    lineHeight: 1.7,
    marginBottom: 12,
  };

  const bulletStyle = {
    marginLeft: 20,
    marginBottom: 8,
  };

  const bulletItemStyle = {
    fontSize: 13,
    color: "var(--muted, #888)",
    lineHeight: 1.6,
    marginBottom: 8,
  };

  return (
    <div style={overlayStyle} onClick={handleBackdrop}>
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>Help & Documentation</h2>
          <button onClick={onClose} style={closeButtonStyle} title="Close">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          <button
            style={tabStyle(activeTab === "overview")}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            style={tabStyle(activeTab === "dashboard")}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            style={tabStyle(activeTab === "agents")}
            onClick={() => setActiveTab("agents")}
          >
            AI Agents
          </button>
          <button
            style={tabStyle(activeTab === "conversations")}
            onClick={() => setActiveTab("conversations")}
          >
            Conversations
          </button>
          <button
            style={tabStyle(activeTab === "faq")}
            onClick={() => setActiveTab("faq")}
          >
            FAQ
          </button>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {activeTab === "overview" && (
            <div>
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Welcome to Orion</h3>
                <p style={contentTextStyle}>
                  Orion is an Autonomous AI Revenue Agent platform that helps businesses automate their sales and customer engagement using production-ready AI agents across WhatsApp, email, and more.
                </p>
              </div>

              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Key Features</h3>
                <div style={bulletStyle}>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>WhatsApp AI Agent</strong> - Deploy intelligent conversational agents on WhatsApp that qualify leads, answer queries, and close deals automatically
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Revenue Analytics</strong> - Real-time dashboards showing conversion rates, engagement metrics, and revenue attribution
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Multi-Channel Outreach</strong> - Unified AI outreach across WhatsApp, email, and SMS with personalized messaging at scale
                  </div>
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Getting Started</h3>
                <p style={contentTextStyle}>
                  Navigate through the different sections using the left sidebar. Each section has specific tools to help you manage your AI agents and customer conversations.
                </p>
              </div>
            </div>
          )}

          {activeTab === "dashboard" && (
            <div>
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Sales Command Center</h3>
                <p style={contentTextStyle}>
                  The Dashboard provides real-time monitoring of your autonomous WhatsApp agents and their performance metrics.
                </p>
              </div>

              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Key Metrics</h3>
                <div style={bulletStyle}>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Conversations</strong> - Total number of active customer conversations
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Response Rate</strong> - Percentage of conversations where AI provided a response
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Conversion Rate</strong> - Percentage of conversations that resulted in sales
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Engagement Time</strong> - Average time spent in conversations
                  </div>
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Dashboard Tips</h3>
                <div style={bulletStyle}>
                  <div style={bulletItemStyle}>
                    Click on any metric card to drill down into detailed analytics
                  </div>
                  <div style={bulletItemStyle}>
                    Use the search bar to find specific campaigns or agents
                  </div>
                  <div style={bulletItemStyle}>
                    Export reports for sharing with your team
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "agents" && (
            <div>
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>AI Agent Management</h3>
                <p style={contentTextStyle}>
                  Create and manage your specialized autonomous sales fleet. Each agent can be configured with different personalities and knowledge bases.
                </p>
              </div>

              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Agent Components</h3>
                <div style={bulletStyle}>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Overview</strong> - View and manage all your AI agents
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Knowledge Base</strong> - Upload documents and information your agents should know
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Websites</strong> - Connect websites for agents to reference
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Links</strong> - Add resource links agents should share
                  </div>
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Best Practices</h3>
                <div style={bulletStyle}>
                  <div style={bulletItemStyle}>
                    Provide comprehensive knowledge base for better responses
                  </div>
                  <div style={bulletItemStyle}>
                    Test your agents before going live
                  </div>
                  <div style={bulletItemStyle}>
                    Regularly update agent personalities and training data
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "conversations" && (
            <div>
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Conversation Management</h3>
                <p style={contentTextStyle}>
                  Browse, analyze, and manage all WhatsApp conversations with your customers. View full transcripts and engagement history.
                </p>
              </div>

              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Features</h3>
                <div style={bulletStyle}>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Full Transcripts</strong> - View complete conversation history
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Search</strong> - Find conversations using keywords
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Filter</strong> - Sort by date, status, or agent
                  </div>
                  <div style={bulletItemStyle}>
                    <strong style={{ color: "var(--fg, #e2e8f0)" }}>Analytics</strong> - View metrics for each conversation
                  </div>
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Conversation Insights</h3>
                <p style={contentTextStyle}>
                  Each conversation shows the intent of the customer, responses provided by the AI, and engagement metrics to help you understand customer needs.
                </p>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div>
              <div style={sectionStyle}>
                <h3 style={sectionTitleStyle}>Frequently Asked Questions</h3>
              </div>

              <div style={sectionStyle}>
                <h4 style={{ ...sectionTitleStyle, textTransform: "none", fontSize: 12 }}>
                  How quickly can I set up Orion?
                </h4>
                <p style={contentTextStyle}>
                  Most businesses are up and running in under 3 minutes. Connect your WhatsApp number, configure your AI agent's personality and knowledge base, and you're live.
                </p>
              </div>

              <div style={sectionStyle}>
                <h4 style={{ ...sectionTitleStyle, textTransform: "none", fontSize: 12 }}>
                  What happens when the AI can't answer a question?
                </h4>
                <p style={contentTextStyle}>
                  Orion intelligently escalates conversations to your human team when it detects complex queries outside its knowledge base, ensuring customers always get the right help.
                </p>
              </div>

              <div style={sectionStyle}>
                <h4 style={{ ...sectionTitleStyle, textTransform: "none", fontSize: 12 }}>
                  Can I customize my AI agent's responses?
                </h4>
                <p style={contentTextStyle}>
                  Yes, you can configure your agent's personality, tone, and behavior through the Knowledge Base and agent settings. Custom training data ensures responses match your brand voice.
                </p>
              </div>

              <div style={sectionStyle}>
                <h4 style={{ ...sectionTitleStyle, textTransform: "none", fontSize: 12 }}>
                  How do I track performance?
                </h4>
                <p style={contentTextStyle}>
                  Use the Analytics page to view real-time metrics including response rates, conversion rates, and customer engagement patterns. Export reports for deeper analysis.
                </p>
              </div>

              <div style={sectionStyle}>
                <h4 style={{ ...sectionTitleStyle, textTransform: "none", fontSize: 12 }}>
                  Can I have multiple AI agents?
                </h4>
                <p style={contentTextStyle}>
                  Yes, different pricing tiers support different numbers of agents. Starter: 1 agent, Growth: 5 agents, Enterprise: Unlimited agents.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
