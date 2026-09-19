import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  BookmarkCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  Shield,
  Plus,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export const AdminLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    {
      name: "Books Management",
      path: "/admin/books",
      icon: BookOpen,
      highlight: true,
    },
    {
      name: "Overview Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Members / Users",
      path: "/admin/students",
      icon: Users,
    },
    {
      name: "Borrowings Log",
      path: "/admin/borrowings",
      icon: BookmarkCheck,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col justify-between shrink-0 shadow-sm z-20">
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-border/70 justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-foreground block leading-tight">
                  Smart Library
                </span>
                <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </div>
            <Badge variant="default" className="text-[10px] uppercase font-bold py-0.5">
              Admin
            </Badge>
          </div>

          {/* Navigation Links */}
          <div className="p-3">
            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Management
            </p>
            <nav className="space-y-1">
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
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                    {item.highlight && (
                      <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-400" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-border/70 bg-muted/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center border border-primary/20 shrink-0">
              {user?.firstName?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate leading-snug">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email || "admin@library.com"}
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

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary hidden sm:inline" />
              <span className="text-sm font-medium text-muted-foreground">
                Control Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NavLink to="/admin/books">
              <Button size="sm" className="gap-1.5 hidden sm:flex">
                <Plus className="w-4 h-4" />
                Add Book
              </Button>
            </NavLink>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Backend Connected
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
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

        {/* Page Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;