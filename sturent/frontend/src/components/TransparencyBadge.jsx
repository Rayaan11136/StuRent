export default function TransparencyBadge({ status }) {
  if (status === "verified") {
    return (
      <span className="badge verified" title="Verified by StuRent">
        🟢 Verified
      </span>
    );
  }
  if (status === "owner") {
    return (
      <span className="badge owner" title="Supplied by the owner, not independently verified">
        🔵 Owner provided
      </span>
    );
  }
  if (status === "estimated") {
    return (
      <span className="badge estimated" title="Calculated or estimated by StuRent">
        🟡 Estimated
      </span>
    );
  }
  return (
    <span className="badge unknown" title="Status not labelled">
      Not labelled
    </span>
  );
}
