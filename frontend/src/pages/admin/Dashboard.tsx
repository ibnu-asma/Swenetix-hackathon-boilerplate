import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  BookmarkCheck,
  TrendingUp,
  ArrowRight,
  Layers,
  ShieldCheck,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "../../features/analytics/analyticsApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export const AdminDashboard: React.FC = () => {
  const { data: stats } = useGetDashboardStatsQuery();

  const totalTitles = stats?.totalBooks ?? 0;
  const totalStock = stats?.totalAvailableCopies ?? 0;
  const totalCategories = stats?.totalCategoriesCount ?? 0;
  const activeMembers = stats?.activeMembersCount ?? 0;
  const activeLoans = stats?.borrowedBooksCount ?? 0;
  const overdueCount = stats?.overdueBooksCount ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 md:p-8 text-primary-foreground shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            Librarian Admin Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Library Administration System
          </h1>
          <p className="text-primary-foreground/80 text-sm max-w-xl">
            Directly control institutional inventory, inspect physical copies, manage subject categories, and monitor live circulation with verified millisecond stock synchronization.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link to="/admin/books">
            <Button variant="secondary" className="gap-2 shadow font-semibold">
              <BookOpen className="w-4 h-4" />
              Manage Books
            </Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant="outline" className="gap-2 font-semibold bg-white/10 hover:bg-white/20 border-white/30 text-white">
              <Layers className="w-4 h-4" />
              Categories
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Catalog Titles
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTitles}</div>
            <p className="text-xs text-muted-foreground mt-1">Cataloged titles</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Available Copies
            </CardTitle>
            <BookmarkCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground mt-1">Physical shelf stock</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Loans
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans}</div>
            <p className="text-xs text-muted-foreground mt-1">Items currently on loan</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Members
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMembers}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered library readers</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="shadow-sm hover:border-primary/40 transition">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Book Inventory
            </CardTitle>
            <CardDescription className="text-xs">
              Add new acquisitions, edit metadata, ISBNs, and quantities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/books">
              <Button size="sm" variant="outline" className="w-full gap-2">
                Open Books Catalog <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:border-primary/40 transition">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Categories & Subjects
            </CardTitle>
            <CardDescription className="text-xs">
              Manage {totalCategories} classification branches and discipline tags.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/categories">
              <Button size="sm" variant="outline" className="w-full gap-2">
                Manage Categories <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:border-primary/40 transition">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Member Directory
            </CardTitle>
            <CardDescription className="text-xs">
              Onboard students, manage access rights, and inspect reader dossiers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/students">
              <Button size="sm" variant="outline" className="w-full gap-2">
                View Members <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Circulation & Analytics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="shadow-sm bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                Circulation & Loan Operations
              </span>
              {overdueCount > 0 && (
                <span className="text-[11px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {overdueCount} Overdue
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              Track borrowed books, due dates, student borrower identities, and process shelf returns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/borrowings">
              <Button size="sm" className="gap-2">
                <BookmarkCheck className="w-4 h-4" />
                View Circulation Log
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-gradient-to-br from-card to-muted/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              In-Depth Analytics
            </CardTitle>
            <CardDescription className="text-xs">
              Comprehensive valuation graphs, category distribution, return telemetry, and fine accruals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/analytics">
              <Button size="sm" variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Open Analytics Console
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;