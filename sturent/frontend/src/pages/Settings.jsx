import { isUsingRemoteApi } from "../services/api.js";
import { DEMO_DISCLAIMER } from "../data/demoData.js";

export default function Settings() {
  const remote = isUsingRemoteApi();
  return (
    <div className="page">
      <h1>Settings</h1>
      <section className="panel">
        <h2>Data source</h2>
        <p>
          API base: <code>{import.meta.env.VITE_API_BASE_URL || "not set"}</code>
        </p>
        <p>
          {remote
            ? "The app will call API Gateway first, then fall back to demo listings if AWS is unavailable."
            : "Running in demo mode. Matching still uses the same rule engine that Lambda deploys."}
        </p>
        <p className="muted">{DEMO_DISCLAIMER}</p>
      </section>
      <section className="panel" style={{ marginTop: 16 }}>
        <h2>Trust</h2>
        <p>
          Payment must never affect a match score. Owner subscriptions, if added later, stay visually separate from
          compatibility.
        </p>
      </section>
    </div>
  );
}
