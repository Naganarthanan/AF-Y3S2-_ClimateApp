import { useAuth } from "../hooks/useAuth";
import { Menu, PanelLeftClose, PanelLeftOpen, Bell, User } from "lucide-react";
import { useState } from "react";

export default function Navbar({
  onMenuClick,
  onToggleCollapse,
  isSidebarCollapsed,
}) {
  const { user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav
      className={`
        fixed top-0 right-0 z-50 h-16 border-b border-white/10
        bg-slate-950/90 backdrop-blur-xl transition-all duration-300 ease-in-out
        ${isSidebarCollapsed ? "lg:left-20" : "lg:left-64"}
        left-0
      `}
    >
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile sidebar open */}
          <button
            onClick={onMenuClick}
            className="inline-flex items-center justify-center p-2 transition-all duration-200 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop collapse / expand */}
          <button
            onClick={onToggleCollapse}
            className="items-center justify-center hidden p-2 transition-all duration-200 lg:inline-flex rounded-xl text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 transition-all duration-200 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowMobileMenu((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-white transition-all duration-200 hover:bg-white/10 md:hidden"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>

              <div className="hidden md:flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                  <User className="w-4 h-4 text-white" />
                </div>

                <div className="hidden lg:block">
                  <p className="max-w-[160px] truncate text-xs font-semibold text-white">
                    {user.email}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-emerald-300">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="hidden px-4 py-2 text-sm font-semibold text-white transition-all duration-200 shadow-lg rounded-xl bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/20 hover:from-red-600 hover:to-red-700 md:inline-flex"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {showMobileMenu && user && (
        <div className="px-4 py-4 border-t border-white/10 bg-slate-950/95 backdrop-blur-xl md:hidden">
          <div className="flex items-center gap-3 p-3 mb-4 border rounded-xl border-white/10 bg-white/5">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.email}</p>
              <p className="text-xs capitalize text-emerald-300">{user.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full rounded-xl bg-red-500/10 px-3 py-2.5 text-left text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}