import React, { useState, useEffect } from "react";
import {
  BookmarkPlus,
  BookOpen,
  User as UserIcon,
  Calendar,
  AlertCircle,
  Loader2,
  Info,
} from "lucide-react";
import { useGetAllUsersQuery } from "../../user/userApi";
import { useGetBooksQuery } from "../../book/bookApi";
import { useAdminBorrowBookMutation } from "../borrowingApi";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";

interface BorrowBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedUserId?: string;
  preselectedBookId?: string;
  onSuccess?: (message: string) => void;
}

export const BorrowBookModal: React.FC<BorrowBookModalProps> = ({
  open,
  onOpenChange,
  preselectedUserId = "",
  preselectedBookId = "",
  onSuccess,
}) => {
  const [userId, setUserId] = useState(preselectedUserId);
  const [bookId, setBookId] = useState(preselectedBookId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Queries
  const { data: users = [], isLoading: isLoadingUsers } = useGetAllUsersQuery();
  const { data: booksData, isLoading: isLoadingBooks } = useGetBooksQuery({ limit: 100 });
  const books = booksData?.data || [];

  // Mutation
  const [borrowBook, { isLoading: isBorrowing }] = useAdminBorrowBookMutation();

  // Reset or initialize on open / preselect changes
  useEffect(() => {
    if (open) {
      setUserId(preselectedUserId);
      setBookId(preselectedBookId);
      setErrorMessage(null);
    }
  }, [open, preselectedUserId, preselectedBookId]);

  // Available books with stock > 0
  const availableBooks = books.filter((b) => {
    const qty = Number(b.quantity) || Number(b.availableCopies) || 0;
    return qty > 0 || (preselectedBookId && (b.id === preselectedBookId || b._id === preselectedBookId));
  });

  // Eligible members
  const members = users.filter((u) => u.role === "member");
  const selectableUsers = members.length > 0 ? members : users;

  // Selected details
  const selectedBook = books.find((b) => (b.id || b._id) === bookId);
  const selectedUser = users.find((u) => (u._id || u.id) === userId);

  const dueDateStr = new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!userId) {
      setErrorMessage("Please select an institutional member.");
      return;
    }
    if (!bookId) {
      setErrorMessage("Please select a book volume to borrow.");
      return;
    }

    try {
      await borrowBook({
        userId,
        bookId,
      }).unwrap();

      const memberName = selectedUser
        ? `${selectedUser.firstName} ${selectedUser.lastName}`
        : "Member";
      const bookTitle = selectedBook ? selectedBook.title : "Book";

      onSuccess?.(`Loan issued: "${bookTitle}" successfully checked out to ${memberName}!`);
      onOpenChange(false);
    } catch (err: any) {
      console.error("Borrow book error:", err);
      setErrorMessage(
        err?.data?.message || err?.message || "Failed to process book loan."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookmarkPlus className="w-5 h-5 text-primary" />
              Issue Institutional Book Loan
            </DialogTitle>
            <DialogDescription>
              Assign a catalog volume to an authorized reader. This automatically adjusts shelf stock and sets a 14-day due date.
            </DialogDescription>
          </DialogHeader>

          {errorMessage && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid gap-4 py-4">
            {/* 1. Member Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-primary" />
                Borrower / Reader *
              </label>
              {isLoadingUsers ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Loading member directory...
                </div>
              ) : (
                <select
                  required
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    Select registered member...
                  </option>
                  {selectableUsers.map((u) => (
                    <option key={u._id || u.id} value={u._id || u.id}>
                      {u.firstName} {u.lastName} ({u.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 2. Book Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                Book Title & Inventory Item *
              </label>
              {isLoadingBooks ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  Loading available holdings...
                </div>
              ) : (
                <select
                  required
                  value={bookId}
                  onChange={(e) => {
                    setBookId(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>
                    Select available book title...
                  </option>
                  {availableBooks.map((b) => {
                    const qty = Number(b.quantity) || Number(b.availableCopies) || 0;
                    return (
                      <option key={b.id || b._id} value={b.id || b._id}>
                        {b.title} — {b.author} ({qty} copy available)
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {/* Loan Terms Preview */}
            <div className="p-3.5 bg-muted/50 rounded-xl border border-border space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  Loan Duration:
                </span>
                <span className="font-semibold text-foreground">
                  14 Days Standard
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-bold text-primary">{dueDateStr}</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-muted-foreground border-t border-border/60">
                <Info className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                <span>Borrowing limit is maximum 3 active books per member.</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isBorrowing || !userId || !bookId}
              className="gap-2"
            >
              {isBorrowing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Processing Loan...
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  Issue Loan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
