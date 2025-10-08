import './AdminTopbar.css'

export default function AdminTopbar({ title }) {
  return (
    <div className="admin-topbar">
      <h2>{title}</h2>
      <div className="admin-profile">
        <img src="/admin-avatar.png" alt="Admin" />
        <span>Admin</span>
      </div>
    </div>
  );
}