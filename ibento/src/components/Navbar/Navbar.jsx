import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        IBENTO
      </div>

      {/* Links */}
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/events">Events</Link>
        </li>

        {/* STUDENT LINKS */}
        {user && role === "student" && (
          <li>
            <Link to="/my-events">My Events</Link>
          </li>
        )}

        {/* ADMIN LINKS */}
        {user && role === "admin" && (
          <>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
            <li>
              <Link to="/admin/registrations">Registrations</Link>
            </li>
            <li>
              <Link to="/admin/report">Reports</Link>
            </li>
          </>
        )}

        {/* AUTH LINKS */}
        {!user && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}

        {user && (
          <li>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
