import "./AdminSidebar.css";

export default function AdminSidebar({ active, setActive }) {
  const links = [
    { key: "dashboard", label: "Dashboard" },
    { key: "orders", label: "Pending Orders" },
    { key: "upload", label: "Upload Product" },
    { key: "inventory", label: "Inventory" }
  ];

  return (
    <aside className="admin-sidebar">
      <nav>
        {links.map((l) => (
          <button
            key={l.key}
            className={`admin-link ${active === l.key ? "active" : ""}`}
            onClick={() => setActive(l.key)}
          >
            {l.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
