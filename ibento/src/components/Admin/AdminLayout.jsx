import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;
