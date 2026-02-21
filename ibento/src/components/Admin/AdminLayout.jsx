import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminLayout({ children }) {
  const { clubName, clubLogo } = useAuth();
  console.log("Club Logo:", clubLogo);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          background: "#051a0e",
          color: "white",
          padding: "20px"
        }}
      >
        <h2>Admin Panel</h2>
        {clubLogo && (
  <img
    src={clubLogo}
    alt="Club Logo"
    style={{
      width: "70px",
      height: "60px",
      objectFit: "scale-down",
      marginTop: "10px"
    }}
  />
)}
        {/* 🔥 Club Name */}
        {clubName && (
          <p
            style={{
              marginTop: "4px",
              fontSize: "14px",
              opacity: 0.8
            }}
          >
            {clubName}
          </p>
        )}

        <div style={{ marginTop: "30px" }}>

          <p>
            <Link to="/admin/checkin" style={{ color: "white" }}>
              Check-In
            </Link>
          </p>

          <p>
            <Link to="/admin/registrations" style={{ color: "white" }}>
              Registrations
            </Link>
          </p>

          <p>
            <Link to="/admin/analytics" style={{ color: "white" }}>
              Analytics
            </Link>
          </p>

          <p>
            <Link to="/admin/report" style={{ color: "white" }}>
              Report
            </Link>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;