export default function CustomTooltip({ active, payload, label, ppp }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      <div className="value">${payload[0].value?.toLocaleString()}</div>
      <div className="label">{ppp ? "PPP-adjusted USD" : "Raw USD"}</div>
    </div>
  );
}
