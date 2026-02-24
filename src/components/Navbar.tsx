import { Link, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, User as UserIcon } from "lucide-react";

export default function Navbar({ user, setUser }: { user: any; setUser: any }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <BookOpen size={28} />
          <span>Study Buddy</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
                <UserIcon size={20} />
                <span className="font-medium">{user.name}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
