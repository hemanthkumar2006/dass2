export default function IntentBadge({ intent }) {
  const map = {
    High: { cls: "badge-high", dot: "#22c55e", label: "High" },
    Medium: { cls: "badge-medium", dot: "#f59e0b", label: "Medium" },
    Low: { cls: "badge-low", dot: "#ef4444", label: "Low" },
  };
  const info = map[intent] || { cls: "badge-low", dot: "#9ca3af", label: intent };
  return (
    <span className={`badge ${info.cls}`}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: info.dot, display: "inline-block", flexShrink: 0 }} />
      {info.label}
    </span>
  );
}