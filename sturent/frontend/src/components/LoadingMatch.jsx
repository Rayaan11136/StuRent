export default function LoadingMatch({ steps, activeIndex, doneCount }) {
  return (
    <div className="matching-screen">
      <div className="matching-card">
        <h2>Finding your matches...</h2>
        <ul className="check-list">
          {steps.map((step, i) => (
            <li key={step} className={i <= activeIndex ? "done" : ""}>
              <span aria-hidden="true">{i <= activeIndex ? "✓" : "○"}</span>
              {step}
            </li>
          ))}
        </ul>
        {typeof doneCount === "number" && activeIndex >= steps.length - 1 && (
          <p>
            <strong>{doneCount} homes matched you</strong>
          </p>
        )}
      </div>
    </div>
  );
}
