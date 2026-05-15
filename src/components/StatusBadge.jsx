export default function StatusBadge({ status }) {
  const key = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge ${key}`}>{status}</span>;
}
