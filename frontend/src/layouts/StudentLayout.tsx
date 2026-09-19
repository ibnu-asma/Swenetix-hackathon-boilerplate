// src/layouts/StudentLayout.tsx
import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  BookMarked,
  History,
  Bookmark,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const StudentLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine prefix: /member or /student
  const basePrefix = location.pathname.startsWith("/member") ? "/member" : "/student";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: `${basePrefix}/dashboard`, icon: LayoutDashboard },
    { name: "Book Catalog", path: `${basePrefix}/books`, icon: BookOpen },
    { name: "My Books", path: `${basePrefix}/my-books`, icon: BookMarked },
    { name: "Borrowing History", path: `${basePrefix}/history`, icon: History },
    { name: "Reservations", path: `${basePrefix}/reservations`, icon: Bookmark },
    { name: "Profile", path: `${basePrefix}/profile`, icon: UserIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col justify-between hidden md:flex shrink-0 shadow-sm z-20">
        <div>
          {/* Logo Header */}
          <div className="h-16 flex items-center px-6 border-b border-border justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Smart Library
              </span>
            </div>
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase">
              Member
            </Badge>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Member Portal
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 shrink-0">
              {user?.firstName?.charAt(0) || "M"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate leading-snug">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-border"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
              Welcome back, {user?.firstName || "Member"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold rounded-full border border-emerald-200/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Stock Synced
            </span>

            {user?.role === "admin" && (
              <NavLink to="/admin/books">
                <Button size="sm" variant="outline" className="text-xs h-8">
                  Switch to Admin
                </Button>
              </NavLink>
            )}

            <div className="flex items-center gap-2 border-l border-border pl-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                {user?.firstName?.charAt(0) || "U"}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-semibold text-foreground leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground capitalize mt-0.5">
                  {user?.role || "member"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border p-4 space-y-1 shadow-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-destructive mt-3"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};