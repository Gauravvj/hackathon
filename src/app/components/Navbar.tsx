import { Link, useLocation } from "react-router";
import { Pill } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-100 p-2 rounded-xl group-hover:bg-blue-200 transition-colors">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">
              MedReminder
            </span>
          </Link>

          {!isAuthPage && (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden sm:block"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
