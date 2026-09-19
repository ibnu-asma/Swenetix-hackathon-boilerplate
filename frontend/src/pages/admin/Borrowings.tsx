import React, { useState, useMemo } from "react";
import {
  BookmarkCheck,
  BookmarkPlus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  BookOpen,
  Calendar,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import {
  useGetAllBorrowingsQuery,
  useAdminReturnBorrowingMutation,
} from "../../features/borrowing/borrowingApi";
import { BorrowBookModal } from "../../features/borrowing/components/BorrowBookModal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export const AdminBorrowings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isBorrowOpen, setIsBorrowOpen] = useState(false);

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  // Queries & Mutations
  const {
    data: borrowings = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBorrowingsQuery();

  const [returnBorrowing, { isLoading: isReturning }] =
    useAdminReturnBorrowingMutation();

  // Metrics
  const stats = useMemo(() => {
    const total = borrowings.length;
    const active = borrowings.filter((b) => b.status === "BORROWED").length;
    const overdue = borrowings.filter((b) => b.status === "OVERDUE").length;
    const returned = borrowings.filter((b) => b.status === "RETURNED").length;
    return { total, active, overdue, returned };
  }, [borrowings]);

  // Filtered List
  const filteredBorrowings = useMemo(() => {
    return borrowings.filter((b) => {
      const bookTitle = b.bookId?.title?.toLowerCase() || "";
      const bookIsbn = b.bookId?.isbn?.toLowerCase() || "";
      const borrowerName = `${b.userId?.firstName || ""} ${b.userId?.lastName || ""}`.toLowerCase();
      const borrowerEmail = b.userId?.email?.toLowerCase() || "";

      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !query ||
        bookTitle.includes(query) ||
        bookIsbn.includes(query) ||
        borrowerName.includes(query) ||
        borrowerEmail.includes(query);

      const matchesStatus =
        statusFilter === "all" || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [borrowings, searchTerm, statusFilter]);

  // Handle Mark as Returned
  const handleReturn = async (borrowingId: string, bookTitle: string) => {
    try {
      await returnBorrowing(borrowingId).unwrap();
      showNotification("success", `"${bookTitle}" was successfully marked as returned!`);
    } catch (err: any) {
      showNotification(
        "error",
        err?.data?.message || err?.message || "Failed to mark book as returned."
      );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {notification && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl shadow-sm border transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <BookmarkCheck className="w-8 h-8 text-primary shrink-0" />
            Circulation & Loan Operations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time circulation log: monitor active borrowings, enforce return deadlines, and restock inventory.
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
            Refresh
          </Button>
          <Button onClick={() => setIsBorrowOpen(true)} className="gap-2 shadow-sm">
            <BookmarkPlus className="w-4 h-4" />
            Issue New Loan
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Circulations
            </CardTitle>
            <BookmarkCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-0.5">All-time loan records</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Loans
            </CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Currently checked out</p>
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
            <div className="text-2xl font-bold text-amber-600">{stats.overdue}</div>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-0.5">
              Requires librarian follow-up
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Completed Returns
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.returned}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Restocked to shelves</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by book title, ISBN, or borrower name/email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <div className="flex items-center gap-2 sm:w-52">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Statuses ({borrowings.length})</option>
                <option value="BORROWED">Active Borrowed ({stats.active})</option>
                <option value="OVERDUE">Overdue ({stats.overdue})</option>
                <option value="RETURNED">Returned ({stats.returned})</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-border/70 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Circulation Log</CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredBorrowings.length} of {borrowings.length} loan records
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-medium">Fetching loan history from backend...</p>
            </div>
          ) : filteredBorrowings.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base mb-1">No Borrowings Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "No circulation records match your filter criteria."
                  : "No books currently checked out or logged."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Book Volume</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Borrowed Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Circulation Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBorrowings.map((item) => {
                  const book = item.bookId || {};
                  const user = item.userId || {};
                  const isOverdue = item.status === "OVERDUE";
                  const isReturned = item.status === "RETURNED";
                  const isBorrowed = item.status === "BORROWED";

                  return (
                    <TableRow key={item._id} className="hover:bg-muted/30">
                      {/* Book */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-14 rounded bg-muted border border-border shrink-0 overflow-hidden">
                            {book.coverImage || book.coverUrl ? (
                              <img
                                src={book.coverImage || book.coverUrl}
                                alt={book.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                <BookOpen className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm line-clamp-1 max-w-xs">
                              {book.title || "Unknown Book"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {book.author} • <span className="font-mono">{book.isbn}</span>
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Borrower */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden border">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.firstName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{user.firstName?.charAt(0) || "U"}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm leading-tight text-foreground">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Borrow Date */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {item.borrowedAt
                              ? new Date(item.borrowedAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Due Date */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span
                            className={
                              isOverdue
                                ? "text-amber-600 font-bold"
                                : "text-foreground"
                            }
                          >
                            {item.dueDate
                              ? new Date(item.dueDate).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {isReturned ? (
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 font-semibold gap-1 text-[11px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Returned
                          </Badge>
                        ) : isOverdue ? (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 font-semibold gap-1 text-[11px]">
                            <AlertTriangle className="w-3 h-3" />
                            Overdue
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 font-semibold gap-1 text-[11px]">
                            <BookOpen className="w-3 h-3" />
                            Active Loan
                          </Badge>
                        )}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        {!isReturned ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReturn(item._id, book.title || "Book")}
                            disabled={isReturning}
                            className="h-8 gap-1.5 text-xs font-semibold text-primary hover:text-primary-foreground hover:bg-primary"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Process Return
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Completed
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Issue Loan Dialog */}
      <BorrowBookModal
        open={isBorrowOpen}
        onOpenChange={setIsBorrowOpen}
        onSuccess={(msg) => showNotification("success", msg)}
      />
    </div>
  );
};

export default AdminBorrowings;