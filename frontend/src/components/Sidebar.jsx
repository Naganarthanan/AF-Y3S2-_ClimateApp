import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  Bell,
  Map,
  BookOpen,
  HelpCircle,
  ClipboardList,
  Home,
  BarChart3,
  FileText,
  Cloud,
  X,
} from "lucide-react";

const citizenNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/map", label: "Map", icon: Map },
  { to: "/education", label: "Education", icon: BookOpen },
  { to: "/quiz", label: "Quiz", icon: HelpCircle },
  { to: "/prep-plan", label: "Prep Plan", icon: ClipboardList },
];

const adminNavItems = [
  { to: "/admin/alerts", label: "Admin Alerts", icon: Bell },
  { to: "/admin/shelters", label: "Shelters", icon: Home },
  { to: "/admin/zones", label: "Zones", icon: Map },
  { to: "/admin/resources", label: "Resources", icon: FileText },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  onCloseMobile,
}) {
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";
  const navItems = isAdmin
    ? [...citizenNavItems, ...adminNavItems]
    : citizenNavItems;

  return (
    <>
      <div
        className={`
          fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition-all duration-300 lg:hidden
          ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onCloseMobile}
      />

      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-white/10
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white shadow-2xl
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          w-72
        `}
      >
        {/* Brand row height same as navbar */}
        <div
          className={`
            flex h-16 items-center border-b border-white/10 px-4
            ${isCollapsed ? "lg:justify-center" : "justify-between"}
          `}
        >
          <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? "lg:justify-center" : ""}`}>
            <div className="flex items-center justify-center w-10 h-10 shadow-lg shrink-0 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500">
              <Cloud className="w-5 h-5 text-white" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <span className="block truncate text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
                  ClimateSafe
                </span>
                <span className="block text-sm font-semibold text-white truncate">
                  Sri Lanka
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onCloseMobile}
            className="p-2 transition-all duration-200 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {user && !isCollapsed && (
          <div className="p-4 mx-3 mt-4 border rounded-2xl border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                <span className="text-sm font-bold text-white">
                  {user.email?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.email}
                </p>
                <p className="text-xs capitalize text-emerald-300">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.to ||
              location.pathname.startsWith(item.to + "/");

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onCloseMobile();
                  }
                }}
                title={isCollapsed ? item.label : ""}
                className={`
                  group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200
                  ${isCollapsed ? "lg:justify-center" : ""}
                  ${
                    isActive
                      ? "border border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-white"
                  }`}
                />

                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium truncate">{item.label}</span>
                    {isActive && (
                      <span className="w-1 h-6 ml-auto rounded-full bg-emerald-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div className="p-3 border-t border-white/10">
            <div className="p-3 border rounded-xl border-emerald-500/20 bg-emerald-500/10">
              <p className="text-xs font-semibold tracking-wide uppercase text-emerald-300">
                Live Monitoring
              </p>
              <p className="mt-1 text-sm text-slate-200">
                Track alerts, regional risk, and preparedness tools in one place.
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}