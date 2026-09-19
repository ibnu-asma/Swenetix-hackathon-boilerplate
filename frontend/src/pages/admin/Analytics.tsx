import React from "react";
import {
  BarChart3,
  BookOpen,
  Users,
  BookmarkCheck,
  AlertTriangle,
  DollarSign,
  Layers,
  RefreshCw,
  Loader2,
  TrendingUp,
  CheckCircle2,
  PieChart,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "../../features/analytics/analyticsApi";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export const AdminAnalytics: React.FC = () => {
  const { data: stats, isLoading, isFetching, refetch } = useGetDashboardStatsQuery();

  const totalBooks = stats?.totalBooks ?? 0;
  const totalAvailableCopies = stats?.totalAvailableCopies ?? 0;
  const borrowedBooksCount = stats?.borrowedBooksCount ?? 0;
  const overdueBooksCount = stats?.overdueBooksCount ?? 0;
  const returnedBooksCount = stats?.returnedBooksCount ?? 0;
  const activeMembersCount = stats?.activeMembersCount ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;
  const categoryStats = stats?.categoryStats ?? [];

  const totalCopiesEver = totalAvailableCopies + borrowedBooksCount;
  const circulationRate =
    totalCopiesEver > 0
      ? ((borrowedBooksCount / totalCopiesEver) * 100).toFixed(1)
      : "0.0";

  const totalCirculationEvents =
    borrowedBooksCount + returnedBooksCount + overdueBooksCount;
  const returnRate =
    totalCirculationEvents > 0
      ? ((returnedBooksCount / totalCirculationEvents) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <BarChart3 className="w-8 h-8 text-primary shrink-0" />
            Institutional Library Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time circulation metrics, holding valuations, category distributions, and overdue revenue telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-1.5"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Sync Live Stats
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
          <p className="text-sm font-semibold">Aggregating live library analytics...</p>
        </div>
      ) : (
        <>
          {/* Top KPI Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Catalog Titles
                </CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalBooks}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {categoryStats.length} disciplines
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Stock Holdings
                </CardTitle>
                <BookmarkCheck className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAvailableCopies}</div>
                <p className="text-xs text-muted-foreground mt-1">Physical shelf copies</p>
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
                <div className="text-2xl font-bold">{borrowedBooksCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {circulationRate}% utilization rate
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-amber-200/50 bg-amber-50/20 dark:bg-amber-950/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  Overdue Items
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {overdueBooksCount}
                </div>
                <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
                  Pending return action
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Active Borrowers
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeMembersCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered student readers
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Returned Circulations
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{returnedBooksCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {returnRate}% return completion rate
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Overdue Fine Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  ${totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Accumulated institutional fees
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown & Distribution */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-primary" />
                  Classification Holdings Distribution
                </CardTitle>
                <CardDescription className="text-xs">
                  Proportionate inventory volume and title breadth across subject branches
                </CardDescription>
              </div>
              <Badge variant="outline" className="gap-1 font-mono text-xs">
                <Layers className="w-3.5 h-3.5" />
                {categoryStats.length} Disciplines
              </Badge>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {categoryStats.map((cat) => {
                  const percent =
                    totalBooks > 0
                      ? Math.round((cat.bookCount / totalBooks) * 100)
                      : 0;

                  return (
                    <div key={cat._id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {cat.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">
                            <strong>{cat.bookCount}</strong> title{cat.bookCount === 1 ? "" : "s"} ({cat.copyCount} copies)
                          </span>
                          <span className="font-bold text-primary w-10 text-right">
                            {percent}%
                          </span>
                        </div>
                      </div>
                      {/* Visual Meter Bar */}
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percent, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;