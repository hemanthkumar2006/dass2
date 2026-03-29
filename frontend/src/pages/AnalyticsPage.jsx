import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import StatCard from "../components/StatCard";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ── Dummy Data ──────────────────────────────────────────────── */
const lineData = [
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

const barData = [
  { day: "Mon", msgs: 1240 },
  { day: "Tue", msgs: 1850 },
  { day: "Wed", msgs: 2100 },
  { day: "Thu", msgs: 1760 },
  { day: "Fri", msgs: 2340 },
  { day: "Sat", msgs: 980 },
  { day: "Sun", msgs: 640 },
];

const areaData = [
  { month: "Jan", revenue: 12400, leads: 340 },
  { month: "Feb", revenue: 15200, leads: 410 },
  { month: "Mar", revenue: 18900, leads: 520 },
  { month: "Apr", revenue: 16700, leads: 480 },
  { month: "May", revenue: 22300, leads: 610 },
  { month: "Jun", revenue: 28100, leads: 740 },
  { month: "Jul", revenue: 24600, leads: 690 },
  { month: "Aug", revenue: 31200, leads: 820 },
];

const donutData = [
  { name: "WhatsApp", value: 45, color: "#7c3aed" },
  { name: "Website", value: 28, color: "#a78bfa" },
  { name: "Instagram", value: 16, color: "#6d28d9" },
  { name: "Referral", value: 11, color: "#ddd6fe" },
];

const agentBarData = [
  { name: "Sales Agent 1", conversion: 24.2, responses: 148 },
  { name: "Lead Gen Bot A", conversion: 18.5, responses: 112 },
  { name: "Support Bot B", conversion: 12.1, responses: 87 },
  { name: "Promo Bot C", conversion: 9.4, responses: 63 },
  { name: "Onboard Bot D", conversion: 6.8, responses: 44 },
];

// Heatmap: hours (0-23) × days (Mon–Sun), value = message count
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"];
const heatmapData = DAYS.map(day =>
  HOURS.map(hour => {
    const base = ["8a", "10a", "12p", "2p", "4p"].includes(hour) ? 60 : 20;
    const weekendDip = ["Sat", "Sun"].includes(day) ? 0.4 : 1;
    return Math.floor((Math.random() * base + 5) * weekendDip);
  })
);
const heatmapMax = Math.max(...heatmapData.flat());

const funnelSteps = [
  { label: "Visitors Reached", value: 8420, pct: 100, color: "#7c3aed" },
  { label: "Conversations Started", value: 4180, pct: 49.6, color: "#8b5cf6" },
  { label: "Leads Qualified", value: 1840, pct: 21.8, color: "#a78bfa" },
  { label: "Meetings Booked", value: 740, pct: 8.8, color: "#c4b5fd" },
  { label: "Deals Closed", value: 218, pct: 2.6, color: "#ddd6fe" },
];

const topAgents = [
  { name: "Sales Agent 1", role: "Outbound High-Ticket", conv: 24.2, pct: 80, resp: "0.4s", esc: "LOW (2%)", escCls: "esc-low" },
  { name: "Lead Gen Bot A", role: "Inbound Qualification", conv: 18.5, pct: 55, resp: "0.7s", esc: "MED (8%)", escCls: "esc-med" },
  { name: "Support Bot B", role: "Technical Support", conv: 12.1, pct: 35, resp: "1.2s", esc: "HIGH (15%)", escCls: "esc-high" },
  { name: "Promo Bot C", role: "Promotions & Offers", conv: 9.4, pct: 28, resp: "0.9s", esc: "LOW (3%)", escCls: "esc-low" },
];

/* ── Icons ───────────────────────────────────────────────────── */
const RevenueIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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

/* ── Tooltip helpers ─────────────────────────────────────────── */
const mkTooltip = (keys) => ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c1c2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", minWidth: 140 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      {keys.map((k, i) => (
        <div key={k.key} style={{ fontSize: 12.5, color: k.color, marginBottom: 2 }}>
          ● {k.label}: <strong>{typeof payload[i]?.value === "number" && k.prefix ? k.prefix : ""}{payload[i]?.value?.toLocaleString()}{k.suffix || ""}</strong>
        </div>
      ))}
    </div>
  );
};

/* ── Custom Donut label ──────────────────────────────────────── */
const renderDonutLabel = ({ name, value, cx, cy, midAngle, outerRadius }) => {
  const RADIAN = Math.PI / 180;
  const r = outerRadius + 22;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="var(--muted)" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11}>
      {name} {value}%
    </text>
  );
};

/* ── Time range selector ─────────────────────────────────────── */
function TimeRange({ options, active, onChange }) {
  return (
    <div className="segmented">
      {options.map(o => (
        <button key={o} className={"segBtn" + (active === o ? " active" : "")} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [lineRange, setLineRange] = useState("30D");
  const [areaRange, setAreaRange] = useState("8M");

  return (
    <div className="stack">

      {/* ── Row 1: KPI cards ─────────────────────────────────── */}
      <div className="grid4">
        <StatCard title="Total Revenue Generated" value="$128,430" delta="+12.5%" icon={<RevenueIcon />} />
        <StatCard title="Avg. Lead Quality Score" value="88/100" delta="+4.2%" icon={<QualityIcon />} />
        <StatCard title="Total Active Agents" value="14" delta="0.0%" icon={<AgentIcon />} />
        <StatCard title="Avg. Response Time" value="0.8s" delta="-2.1%" icon={<SpeedIcon />} />
      </div>

      {/* ── Row 2: extra KPI mini-cards ──────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
        {[
          { label: "Leads Qualified", value: "1,840", sub: "this month", accent: "#7c3aed" },
          { label: "Meetings Booked", value: "740", sub: "+18% vs last", accent: "#34d399" },
          { label: "Messages Sent", value: "24,813", sub: "all channels", accent: "#a78bfa" },
          { label: "Satisfaction", value: "4.7 ★", sub: "out of 5.0", accent: "#fbbf24" },
          { label: "Deals Closed", value: "218", sub: "~$589 avg", accent: "#f472b6" },
        ].map(k => (
          <div key={k.label} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.accent, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Row 3: Line chart + Bar chart ────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Line chart */}
        <div className="card">
          <div className="cardHeaderRow">
            <div>
              <div className="cardTitle">Conversations vs. Bookings</div>
              <div className="cardSub">Activity over the last 30 days</div>
            </div>
            <TimeRange options={["7D", "30D", "90D"]} active={lineRange} onChange={setLineRange} />
          </div>
          <div style={{ height: 220, marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={mkTooltip([{ key: "conv", label: "Conversations", color: "#8b5cf6" }, { key: "book", label: "Bookings", color: "#d1d5db" }])} />
                <Line type="monotone" dataKey="conv" stroke="#7c3aed" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#7c3aed" }} />
                <Line type="monotone" dataKey="book" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeDasharray="6 4" dot={false} activeDot={{ r: 4, fill: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 8, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
            <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 3, background: "#7c3aed", borderRadius: 4, display: "inline-block" }} /> Conversations
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 2, background: "rgba(255,255,255,0.35)", display: "inline-block", borderBottom: "2px dashed rgba(255,255,255,.35)" }} /> Bookings
            </span>
          </div>
        </div>

        {/* Bar chart – daily message volume */}
        <div className="card">
          <div className="cardHeaderRow">
            <div>
              <div className="cardTitle">Daily Message Volume</div>
              <div className="cardSub">Messages processed per day of week</div>
            </div>
          </div>
          <div style={{ height: 220, marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={28}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={mkTooltip([{ key: "msgs", label: "Messages", color: "#a78bfa" }])} cursor={{ fill: "rgba(124,58,237,0.06)" }} />
                <Bar dataKey="msgs" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={i === 4 ? "#7c3aed" : "rgba(124,58,237,0.45)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
            Peak: <strong style={{ color: "var(--accent)" }}>Friday — 2,340 msgs</strong> · Lowest: Sunday
          </div>
        </div>
      </div>

      {/* ── Row 4: Area chart + Donut chart ──────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16 }}>

        {/* Area chart – revenue & leads */}
        <div className="card">
          <div className="cardHeaderRow">
            <div>
              <div className="cardTitle">Revenue &amp; Lead Trend</div>
              <div className="cardSub">Monthly revenue vs. leads acquired</div>
            </div>
            <TimeRange options={["3M", "6M", "8M"]} active={areaRange} onChange={setAreaRange} />
          </div>
          <div style={{ height: 220, marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradLead" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="rev" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="lead" orientation="right" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={mkTooltip([{ key: "revenue", label: "Revenue", color: "#a78bfa", prefix: "$" }, { key: "leads", label: "Leads", color: "#34d399" }])} />
                <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#gradRev)" dot={false} activeDot={{ r: 5, fill: "#7c3aed" }} />
                <Area yAxisId="lead" type="monotone" dataKey="leads" stroke="#34d399" strokeWidth={2} fill="url(#gradLead)" dot={false} activeDot={{ r: 5, fill: "#34d399" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut – lead sources */}
        <div className="card">
          <div className="cardHeaderRow">
            <div>
              <div className="cardTitle">Lead Sources</div>
              <div className="cardSub">Where customers come from</div>
            </div>
          </div>
          <div style={{ height: 180, marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={82} dataKey="value" paddingAngle={3}>
                  {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(val, name) => [`${val}%`, name]} contentStyle={{ background: "#1c1c2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
            {donutData.map(d => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "var(--muted)" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0, display: "inline-block" }} />
                  {d.name}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg)" }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 5: Agent bar chart + Conversion funnel ───────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Horizontal bar – agent performance */}
        <div className="card">
          <div className="cardHeaderRow">
            <div className="cardTitle">Agent Conversion Rates</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
            {agentBarData.map(a => (
              <div key={a.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg)" }}>{a.name}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--accent)" }}>{a.conversion}%</span>
                </div>
                <div style={{ height: 8, borderRadius: 6, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(a.conversion / 30) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 6, transition: "width 0.5s ease" }} />
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{a.responses} responses this week</div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion funnel */}
        <div className="card">
          <div className="cardHeaderRow">
            <div>
              <div className="cardTitle">Conversion Funnel</div>
              <div className="cardSub">Visitor → Deal pipeline</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            {funnelSteps.map((step, i) => (
              <div key={step.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{step.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
                    {step.value.toLocaleString()}
                    <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: 6 }}>{step.pct}%</span>
                  </span>
                </div>
                <div style={{ height: 10, borderRadius: 6, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${step.pct}%`, background: step.color, borderRadius: 6, transition: "width 0.6s ease" }} />
                </div>
                {i < funnelSteps.length - 1 && (
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3, textAlign: "right" }}>
                    ↓ {(((funnelSteps[i + 1].value / step.value) * 100).toFixed(1))}% pass through
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 6: Activity heatmap ───────────────────────────── */}
      <div className="card">
        <div className="cardHeaderRow">
          <div>
            <div className="cardTitle">Message Activity Heatmap</div>
            <div className="cardSub">Volume by hour and day of week — darker = more activity</div>
          </div>
        </div>
        <div style={{ marginTop: 16, overflowX: "auto" }}>
          {/* Hour labels */}
          <div style={{ display: "grid", gridTemplateColumns: `44px repeat(${HOURS.length},1fr)`, gap: 3, marginBottom: 4 }}>
            <div />
            {HOURS.map(h => (
              <div key={h} style={{ fontSize: 9, color: "var(--muted)", textAlign: "center", fontWeight: 600 }}>{h}</div>
            ))}
          </div>
          {/* Grid rows */}
          {DAYS.map((day, di) => (
            <div key={day} style={{ display: "grid", gridTemplateColumns: `44px repeat(${HOURS.length},1fr)`, gap: 3, marginBottom: 3 }}>
              <div style={{ fontSize: 10.5, color: "var(--muted)", fontWeight: 600, display: "flex", alignItems: "center" }}>{day}</div>
              {heatmapData[di].map((val, hi) => {
                const intensity = val / heatmapMax;
                return (
                  <div key={hi} title={`${day} ${HOURS[hi]}: ${val} msgs`} style={{
                    height: 22, borderRadius: 4,
                    background: intensity > 0.05
                      ? `rgba(124,58,237,${0.08 + intensity * 0.82})`
                      : "rgba(255,255,255,0.03)",
                    cursor: "default", transition: "transform 0.1s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
            <span style={{ fontSize: 10, color: "var(--muted)" }}>Less</span>
            {[0.08, 0.3, 0.5, 0.7, 0.9].map((op, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: `rgba(124,58,237,${op})` }} />
            ))}
            <span style={{ fontSize: 10, color: "var(--muted)" }}>More</span>
          </div>
        </div>
      </div>

      {/* ── Row 7: Top agents table ───────────────────────────── */}
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