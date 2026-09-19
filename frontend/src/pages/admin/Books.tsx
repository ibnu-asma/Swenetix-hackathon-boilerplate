import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Layers,
  Archive,
  RefreshCw,
  Loader2,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import {
  useGetBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} from "../../features/book/bookApi";
import { Book } from "../../features/book/types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

export const AdminBooks: React.FC = () => {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch Books and Categories from backend
  const {
    data: booksData,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
    refetch: refetchBooks,
  } = useGetBooksQuery({
    search: searchTerm,
    category: selectedCategory === "all" ? undefined : selectedCategory,
    limit: 100,
  });

  const { data: categories = [] } = useGetCategoriesQuery();

  // Mutations
  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();
  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();

  // Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selected Book for Edit/Delete
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    categoryId: "",
    quantity: 1,
    description: "",
    coverImage: "",
  });

  // Quick Category creation within modal
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  // Toast / Alert Notification State
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const books = useMemo(() => booksData?.data || [], [booksData?.data]);

  // Summary Metrics
  const stats = useMemo(() => {
    const totalTitles = books.length;
    const totalCopies = books.reduce(
      (acc, b) => acc + (Number(b.quantity) || Number(b.totalCopies) || 0),
      0
    );
    const uniqueCategories = new Set(books.map((b) => b.categoryName || b.category))
      .size;
    const lowStock = books.filter(
      (b) => (Number(b.quantity) || Number(b.availableCopies) || 0) <= 2
    ).length;

    return { totalTitles, totalCopies, uniqueCategories, lowStock };
  }, [books]);

  // Open Add Dialog
  const handleOpenAdd = () => {
    setFormData({
      title: "",
      author: "",
      isbn: "",
      categoryId: categories[0]?._id || "",
      quantity: 5,
      description: "",
      coverImage: "",
    });
    setIsAddingNewCategory(false);
    setNewCategoryName("");
    setIsAddOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (book: Book) => {
    setActiveBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      categoryId: book.categoryId || categories[0]?._id || "",
      quantity: Number(book.quantity) || Number(book.totalCopies) || 1,
      description: book.description || "",
      coverImage: book.coverImage || book.coverUrl || "",
    });
    setIsAddingNewCategory(false);
    setIsEditOpen(true);
  };

  // Open Delete Dialog
  const handleOpenDelete = (book: Book) => {
    setActiveBook(book);
    setIsDeleteOpen(true);
  };

  // Handle Quick Category Create
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const created = await createCategory({
        name: newCategoryName.trim(),
      }).unwrap();
      const newId = (created as any)?._id || (created as any)?.data?._id;
      if (newId) {
        setFormData((prev) => ({ ...prev, categoryId: newId }));
      }
      setIsAddingNewCategory(false);
      setNewCategoryName("");
      showNotification("success", "Category created successfully!");
    } catch (err: any) {
      showNotification(
        "error",
        err?.data?.message || "Failed to create category."
      );
    }
  };

  // Submit Add Book
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      showNotification("error", "Please select or create a category.");
      return;
    }

    try {
      await addBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim(),
        categoryId: formData.categoryId,
        quantity: Number(formData.quantity) || 1,
        description: formData.description.trim(),
        coverImage: formData.coverImage.trim() || undefined,
      }).unwrap();

      setIsAddOpen(false);
      showNotification("success", `"${formData.title}" was added successfully!`);
    } catch (err: any) {
      console.error("Add book error:", err);
      showNotification(
        "error",
        err?.data?.message || err?.message || "Failed to add book. Ensure ISBN is unique."
      );
    }
  };

  // Submit Edit Book
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBook) return;

    try {
      await updateBook({
        id: activeBook.id || activeBook._id,
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim(),
        categoryId: formData.categoryId,
        quantity: Number(formData.quantity) || 1,
        description: formData.description.trim(),
        coverImage: formData.coverImage.trim() || undefined,
      }).unwrap();

      setIsEditOpen(false);
      showNotification("success", `"${formData.title}" was updated successfully!`);
    } catch (err: any) {
      console.error("Update book error:", err);
      showNotification(
        "error",
        err?.data?.message || "Failed to update book details."
      );
    }
  };

  // Submit Delete Book
  const handleDeleteSubmit = async () => {
    if (!activeBook) return;

    try {
      await deleteBook(activeBook.id || activeBook._id).unwrap();
      setIsDeleteOpen(false);
      showNotification("success", `"${activeBook.title}" deleted.`);
    } catch (err: any) {
      console.error("Delete book error:", err);
      showNotification(
        "error",
        err?.data?.message || "Failed to delete book."
      );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Alert Notification */}
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
            <BookOpen className="w-8 h-8 text-primary shrink-0" />
            Book Inventory Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time catalog control: register new accessions, modify holdings, and synchronize library stock.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchBooks()}
            disabled={isFetchingBooks}
            className="gap-1.5"
          >
            <RefreshCw
              className={`w-4 h-4 ${isFetchingBooks ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={handleOpenAdd} className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Add New Book
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Titles
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTitles}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Active titles cataloged</p>
          </CardContent>
        </Card>
{/* 
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Copies
            </CardTitle>
            <Archive className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCopies}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Physical items on shelf</p>
          </CardContent>
        </Card> */}

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Categories
            </CardTitle>
            <Layers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Subject disciplines</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Low Stock Alerts
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.lowStock}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">2 or fewer copies left</p>
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
                placeholder="Search by book title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <div className="flex items-center gap-2 sm:w-64">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-border/70 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Institutional Book Holdings</CardTitle>
            <CardDescription className="text-xs">
              Showing {books.length} book{books.length === 1 ? "" : "s"} in repository
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoadingBooks ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-medium">Fetching books from backend...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base mb-1">No Books Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                {searchTerm || selectedCategory !== "all"
                  ? "No books match your active filters. Try adjusting your search query."
                  : "The library collection is currently empty. Add the first book to get started."}
              </p>
              <Button onClick={handleOpenAdd} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Book
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[80px]">Cover</TableHead>
                  <TableHead>Book Information</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Stock / Qty</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => {
                  const qty = Number(book.quantity) || Number(book.totalCopies) || 1;
                  return (
                    <TableRow key={book.id || book._id} className="hover:bg-muted/30">
                      {/* Cover Thumbnail */}
                      <TableCell>
                        <div className="w-12 h-16 rounded-md overflow-hidden bg-muted border border-border shrink-0">
                          <img
                            src={book.coverUrl || book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      </TableCell>

                      {/* Title & Details */}
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-semibold text-foreground leading-snug line-clamp-1">
                            {book.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground/80">
                              {book.author}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[11px]">
                              ISBN: {book.isbn}
                            </span>
                          </div>
                          {book.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                              {book.description}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="secondary" className="font-medium gap-1 text-xs">
                          <Tag className="w-3 h-3" />
                          {book.categoryName || book.category || "General"}
                        </Badge>
                      </TableCell>

                      {/* Stock Quantity */}
                      <TableCell className="text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-bold">{qty}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              qty > 3
                                ? "bg-emerald-100 text-emerald-800"
                                : qty > 0
                                ? "bg-amber-100 text-amber-800"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {qty > 3 ? "In Stock" : qty > 0 ? "Low Stock" : "Depleted"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Shelf Location */}
                      <TableCell>
                        <span className="text-xs text-muted-foreground font-medium">
                          {book.floor || "Floor 2"} • {book.shelf || "Section B"}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(book)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            title="Edit Book"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDelete(book)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete Book"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ================= ADD BOOK DIALOG ================= */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleAddSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Book to Catalog
              </DialogTitle>
              <DialogDescription>
                Fill in the details to register a new volume into the institutional database.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Title *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Clean Architecture"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Author *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Robert C. Martin"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    ISBN *
                  </label>
                  <Input
                    required
                    placeholder="e.g. 978-0134494166"
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quantity / Copies *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              {/* Category Dropdown & Quick Create */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    {isAddingNewCategory ? "Cancel New Category" : "+ Add New Category"}
                  </button>
                </div>

                {isAddingNewCategory ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="New category name..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateCategory}
                      disabled={isCreatingCategory || !newCategoryName.trim()}
                    >
                      {isCreatingCategory ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                ) : (
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cover Image URL (Optional)
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.coverImage}
                    onChange={(e) =>
                      setFormData({ ...formData, coverImage: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description / Synopsis
                </label>
                <textarea
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Summary of book contents and editions..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Create Book"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= EDIT BOOK DIALOG ================= */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                Modify Book Record
              </DialogTitle>
              <DialogDescription>
                Update inventory quantity, category, or bibliographic data.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Title *
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Author *
                  </label>
                  <Input
                    required
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    ISBN *
                  </label>
                  <Input
                    required
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quantity / Total Copies *
                  </label>
                  <Input
                    type="number"
                    min={1}
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cover Image URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cover Image URL
                </label>
                <Input
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Record"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE CONFIRMATION DIALOG ================= */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Confirm Book Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to permanently delete{" "}
              <strong className="text-foreground">
                "{activeBook?.title}"
              </strong>{" "}
              (ISBN: {activeBook?.isbn}) from institutional holdings? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteSubmit}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Book"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBooks;