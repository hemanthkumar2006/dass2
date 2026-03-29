export default function StatCard({ title, value, delta, sub, icon, barPercent }) {
  const isNeg = delta && delta.startsWith("-");
  return (
    <div className="card statCard">
      <div className="statTop">
        <div className="statLabel">{title}</div>
        {icon && (
          <div className="statIconBox">{icon}</div>
        )}
      </div>
      <div className="statValueRow">
        <div className="statValue">{value}</div>
        {delta && (
          <span className={`deltaText ${isNeg ? "delta-negative" : "delta-positive"}`}>
            {isNeg ? "↘" : "↗"} {delta}
          </span>
        )}
      </div>
      {sub && <div className="statSub">{sub}</div>}
      {barPercent !== undefined && (
        <div className="statBar">
          <div className="statBarFill" style={{ width: `${barPercent}%` }} />
        </div>
      )}
    </div>
  );
}