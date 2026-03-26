import { NavLink, Route, Routes } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem", maxWidth: 640 }}>
      <h1>Miiddle</h1>
      <p>
        Standalone Miiddle app. When embedded in PMO-Ops, this UI loads inside an iframe under{" "}
        <code>/miiddle/*</code>.
      </p>
      <nav style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{ padding: "2rem", maxWidth: 640 }}>
      <h1>Dashboard</h1>
      <p>Replace this placeholder with Miiddle product routes per the master build plan.</p>
      <NavLink to="/">Home</NavLink>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
