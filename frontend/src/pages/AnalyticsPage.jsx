import StatCard from "../components/StatCard";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

const chartData = [
  { date: "May 01", conv: 580, book: 210 },
  { date: "May 05", conv: 720, book: 265 },
  { date: "May 10", conv: 900, book: 310 },
  { date: "May 14", conv: 1100, book: 380 },
  { date: "May 17", conv: 820, book: 290 },
  { date: "May 20", conv: 1248, book: 412 },
  { date: "May 24", conv: 1050, book: 370 },
  { date: "May 27", conv: 1180, book: 390 },
  { date: "May 30", conv: 980, book: 340 },
];

const topAgents = [
  { name: "Sales Agent 1", role: "Outbound High-Ticket", conv: 24.2, pct: 80, resp: "0.4s", esc: "LOW (2%)", escCls: "esc-low" },
  { name: "Lead Gen Bot A", role: "Inbound Qualification", conv: 18.5, pct: 55, resp: "0.7s", esc: "MED (8%)", escCls: "esc-med" },
  { name: "Support Bot B", role: "Technical Support", conv: 12.1, pct: 35, resp: "1.2s", esc: "HIGH (15%)", escCls: "esc-high" },
];

const RevenueIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);
const QualityIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const AgentIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const SpeedIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const LaunchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c1c2e", border: "1px solid var(--border2)", borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ color: "#8b5cf6" }}>● Conversations: {payload[0]?.value.toLocaleString()}</span>
        <span style={{ color: "#d1d5db" }}>● Bookings: {payload[1]?.value.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  return (
    <div className="stack">
      <div className="grid4">
        <StatCard title="Total Revenue Generated" value="$128,430.00" delta="+12.5%" icon={<RevenueIcon />} />
        <StatCard title="Avg. Lead Quality Score" value="88/100" delta="+4.2%" icon={<QualityIcon />} />
        <StatCard title="Total Active Agents" value="14" delta="0.0%" icon={<AgentIcon />} />
        <StatCard title="Avg. Response Time" value="0.8s" delta="-2.1%" icon={<SpeedIcon />} />
      </div>

      {/* Chart */}
      <div className="card">
        <div className="cardHeaderRow">
          <div>
            <div className="cardTitle">Total Conversations vs. Bookings</div>
            <div className="cardSub">Activity over the last 30 days across all agents</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <div className="segmented">
              <button className="segBtn active">30D</button>
              <button className="segBtn">7D</button>
              <button className="segBtn">24H</button>
            </div>
            <button className="btn btn-ghost" style={{ padding: "5px 10px" }}>⋮</button>
          </div>
        </div>
        <div style={{ height: 280, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="conv" stroke="#7c3aed" strokeWidth={2.5} dot={false}
                activeDot={{ r: 5, fill: "#7c3aed" }} />
              <Line type="monotone" dataKey="book" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5}
                strokeDasharray="6 4" dot={false} activeDot={{ r: 4, fill: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top agents table */}
      <div className="card">
        <div className="cardHeaderRow">
          <div className="cardTitle">Top Performing Agents</div>
          <button className="btn-link">View All Agents</button>
        </div>

        <div className="topAgentRow head">
          <div>Agent Name</div><div>Conversion Rate</div>
          <div>Avg. Response</div><div>Human Escalation</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>

        {topAgents.map((a) => (
          <div className="topAgentRow" key={a.name}>
            <div className="leadCell">
              <div className="leadAvatar" style={{ fontSize: 10 }}>
                {a.name.split(" ").map(s => s[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="leadName">{a.name}</div>
                <div className="leadSub">{a.role}</div>
              </div>
            </div>
            <div className="convBar">
              <span style={{ fontSize: 13, fontWeight: 700, width: 44 }}>{a.conv}%</span>
              <div className="convBarTrack">
                <div className="convBarFill" style={{ width: `${a.pct}%` }} />
              </div>
            </div>
            <div className="muted">{a.resp}</div>
            <div><span className={`escBadge ${a.escCls}`}>{a.esc}</span></div>
            <div style={{ textAlign: "right" }}>
              <button className="btn btn-ghost" style={{ padding: "5px 9px" }}><LaunchIcon /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}