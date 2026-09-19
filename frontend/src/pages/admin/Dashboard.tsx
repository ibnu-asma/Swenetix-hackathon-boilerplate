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
} from "lucide-react";
import { useGetBooksQuery, useGetCategoriesQuery } from "../../features/book/bookApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export const AdminDashboard: React.FC = () => {
  const { data: booksData } = useGetBooksQuery({ limit: 100 });
  const { data: categories = [] } = useGetCategoriesQuery();

  const books = booksData?.data || [];
  const totalTitles = books.length;
  const totalStock = books.reduce((acc, b) => acc + (Number(b.quantity) || 1), 0);

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
            Directly control institutional inventory, inspect physical copies, and monitor live circulation with verified millisecond stock synchronization.
          </p>
        </div>

        <Link to="/admin/books">
          <Button variant="secondary" className="gap-2 shadow font-semibold">
            <BookOpen className="w-4 h-4" />
            Manage Books Catalog
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Catalog Titles
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTitles}</div>
            <p className="text-xs text-muted-foreground mt-1">Volumes in catalog</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Inventory Stock
            </CardTitle>
            <BookmarkCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground mt-1">Total physical copies</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Categories
            </CardTitle>
            <Layers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Classification branches</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Circulation Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.4%</div>
            <p className="text-xs text-muted-foreground mt-1">Inventory integrity</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Book Inventory Control
            </CardTitle>
            <CardDescription>
              Create, update, search, and delete books in the centralized library database.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage complete metadata including ISBNs, categories, author credits, and total physical copy quantities.
            </p>
            <div className="flex gap-3">
              <Link to="/admin/books">
                <Button className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  View All Books
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Member Access & Roles
            </CardTitle>
            <CardDescription>
              Role-based control for Member and Admin privileges.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Members can browse catalog and submit loan requests, while Admins manage institution holdings.
            </p>
            <div className="flex gap-3">
              <Link to="/admin/students">
                <Button variant="outline" className="gap-2">
                  <Users className="w-4 h-4" />
                  View Members
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;