export default function MetricCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="metric-card">
      <div className="metric-icon">{Icon && <Icon size={20} />}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      {helper && <small>{helper}</small>}
    </div>
  );
}
