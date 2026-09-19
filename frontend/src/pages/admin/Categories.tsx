import React, { useState, useMemo } from "react";
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  RefreshCw,
  Loader2,
  Tag,
  Hash,
} from "lucide-react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetBooksQuery,
} from "../../features/book/bookApi";
import { Category } from "../../features/book/types";
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

export const AdminCategories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");

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
    data: categories = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetCategoriesQuery();

  const { data: booksData } = useGetBooksQuery({ limit: 1000 });
  const books = booksData?.data || [];

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // Book counts per category
  const categoryBookCounts = useMemo(() => {
    const map = new Map<string, number>();
    books.forEach((book) => {
      const catId = book.categoryId;
      if (catId) {
        map.set(catId, (map.get(catId) || 0) + 1);
      }
    });
    return map;
  }, [books]);

  // Filter categories
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const lower = searchTerm.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(lower));
  }, [categories, searchTerm]);

  // Handle Add
  const handleOpenAdd = () => {
    setCategoryName("");
    setIsAddOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      await createCategory({ name: categoryName.trim() }).unwrap();
      setIsAddOpen(false);
      setCategoryName("");
      showNotification("success", `Category "${categoryName.trim()}" created successfully!`);
    } catch (err: any) {
      showNotification("error", err?.data?.message || "Failed to create category.");
    }
  };

  // Handle Edit
  const handleOpenEdit = (category: Category) => {
    setActiveCategory(category);
    setCategoryName(category.name);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory || !categoryName.trim()) return;

    try {
      await updateCategory({
        id: activeCategory._id,
        name: categoryName.trim(),
      }).unwrap();
      setIsEditOpen(false);
      showNotification("success", `Category updated to "${categoryName.trim()}"!`);
    } catch (err: any) {
      showNotification("error", err?.data?.message || "Failed to update category.");
    }
  };

  // Handle Delete
  const handleOpenDelete = (category: Category) => {
    setActiveCategory(category);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!activeCategory) return;

    try {
      await deleteCategory(activeCategory._id).unwrap();
      setIsDeleteOpen(false);
      showNotification("success", `Category "${activeCategory.name}" removed successfully.`);
    } catch (err: any) {
      showNotification("error", err?.data?.message || "Failed to delete category.");
    }
  };

  const activeCategoryBookCount = activeCategory
    ? categoryBookCounts.get(activeCategory._id) || 0
    : 0;

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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Layers className="w-8 h-8 text-primary shrink-0" />
            Category & Classification Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize institutional catalog classifications, subject headings, and thematic groupings.
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
          <Button onClick={handleOpenAdd} className="gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Categories
            </CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Active catalog branches</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Categorized Titles
            </CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{books.length}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Books mapped to subjects</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Avg Titles / Category
            </CardTitle>
            <Tag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {categories.length > 0 ? (books.length / categories.length).toFixed(1) : "0"}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Distribution balance</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search category names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-border/70 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Classification Disciplines</CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredCategories.length} categor{filteredCategories.length === 1 ? "y" : "ies"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-medium">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base mb-1">No Categories Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                {searchTerm
                  ? "No categories matched your query. Try a different search term."
                  : "No classification categories registered yet."}
              </p>
              <Button onClick={handleOpenAdd} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add First Category
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[80px]">#</TableHead>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Associated Books</TableHead>
                  <TableHead>System Identifier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((cat, idx) => {
                  const bookCount = categoryBookCounts.get(cat._id) || 0;
                  return (
                    <TableRow key={cat._id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-semibold text-foreground">
                            {cat.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={bookCount > 0 ? "default" : "secondary"}
                          className="font-medium gap-1 text-xs"
                        >
                          <BookOpen className="w-3 h-3" />
                          {bookCount} Book{bookCount === 1 ? "" : "s"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                          <Hash className="w-3 h-3" />
                          <span>{cat._id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(cat)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDelete(cat)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete Category"
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

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Register New Category
              </DialogTitle>
              <DialogDescription>
                Define a new subject heading for classifying institutional holdings.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category Name *
                </label>
                <Input
                  required
                  placeholder="e.g. Artificial Intelligence & Robotics"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  autoFocus
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
              <Button type="submit" disabled={isCreating || !categoryName.trim()}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                Edit Category Name
              </DialogTitle>
              <DialogDescription>
                Modify the classification label. All linked books will reflect this update.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Category Name *
                </label>
                <Input
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  autoFocus
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
              <Button type="submit" disabled={isUpdating || !categoryName.trim()}>
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Confirm Category Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to remove the category{" "}
              <strong className="text-foreground">
                "{activeCategory?.name}"
              </strong>
              ?
              {activeCategoryBookCount > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertCircle className="w-4 h-4" />
                    Warning: Books Associated
                  </div>
                  There are currently <strong>{activeCategoryBookCount}</strong> book(s)
                  assigned to this category.
                </div>
              )}
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
                "Delete Category"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;
