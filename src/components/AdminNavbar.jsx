import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"
import {
  Building2, LayoutDashboard, List, Users, LogOut, Menu,
  X, User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { to: "/admindash", label: "Dashboard", icon: LayoutDashboard },
  { to: "/managebookings", label: "Bookings", icon: List },
  { to: "/manageusers", label: "Users", icon: Users },
  { to: "/managelistings", label: "Listings", icon: Users },
];

function AdminNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
   <nav className="bg-[#0E1733] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
 
        {/* Logo */}
        <Link to="/admindash" className="flex items-center gap-2">
          <Building2 className="w-7 h-7" />
          <span className="text-xl md:text-2xl font-bold">
            UniStay Admin
          </span>
        </Link>
 
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
 
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 pb-1 border-b-2 transition ${isActive
                    ? "text-[#F98603] border-[#F98603] font-semibold"
                    : "border-transparent hover:text-[#F98603]"
                  }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
 
        
         <div className="flex items-center gap-3">
 
 
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-[#0E1733] px-4 py-2 rounded-lg hover:bg-[#F98603] hover:text-white transition cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
 
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
 
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#16234b]">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
 
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-4 border-b border-white/10 transition ${
                  isActive ? "text-[#F98603] font-semibold" : "hover:text-[#F98603]"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}

 
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-red-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );

}

export default AdminNavbar;