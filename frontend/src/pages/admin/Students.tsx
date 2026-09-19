import React, { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Shield,
  GraduationCap,
  RefreshCw,
  Loader2,
  Mail,
  Calendar,
  Eye,
  Key,
} from "lucide-react";
import {
  useGetAllUsersQuery,
  useAddMemberMutation,
  useDeleteUserMutation,
  UserMember,
} from "../../features/user/userApi";
import { useAppSelector } from "../../app/hooks";
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

export const AdminStudents: React.FC = () => {
  const { user: currentUser } = useAppSelector((state) => state.auth);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selected User for View / Delete
  const [activeUser, setActiveUser] = useState<UserMember | null>(null);

  // Form State for Add Member
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "member" as "member" | "librarian",
    profileImage: "",
  });

  // Temporary password display after creation
  const [createdCredentials, setCreatedCredentials] = useState<{
    email: string;
    temporaryPassword?: string;
  } | null>(null);

  // Toast notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Queries & Mutations
  const {
    data: users = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetAllUsersQuery();

  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Metrics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const members = users.filter((u) => u.role === "member").length;
    const librarians = users.filter((u) => u.role === "librarian").length;
    return { totalUsers, members, librarians };
  }, [users]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const email = (u.email || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        !search || fullName.includes(search) || email.includes(search);

      const matchesRole =
        selectedRole === "all" || u.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  // Handlers
  const handleOpenAdd = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "member",
      profileImage: "",
    });
    setCreatedCredentials(null);
    setIsAddOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      showNotification("error", "Please fill in all required fields.");
      return;
    }

    try {
      const res = await addMember({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        profileImage: formData.profileImage.trim() || undefined,
      }).unwrap();

      setCreatedCredentials({
        email: formData.email.trim().toLowerCase(),
        temporaryPassword: res.data?.temporaryPassword || "TemporaryPassword123!",
      });

      showNotification("success", `Member ${formData.firstName} provisioned successfully!`);
    } catch (err: any) {
      showNotification(
        "error",
        err?.data?.message || "Failed to provision member account."
      );
    }
  };

  const handleOpenView = (user: UserMember) => {
    setActiveUser(user);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (user: UserMember) => {
    setActiveUser(user);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!activeUser) return;

    const targetId = activeUser._id || activeUser.id;
    if (!targetId) return;

    const currentUserId = currentUser?._id || currentUser?.id;
    if (currentUserId && (currentUserId === targetId || currentUser?.email === activeUser.email)) {
      showNotification("error", "You cannot delete your own administrative account.");
      setIsDeleteOpen(false);
      return;
    }

    try {
      await deleteUser(targetId).unwrap();
      setIsDeleteOpen(false);
      showNotification("success", `Account for ${activeUser.email} was removed.`);
    } catch (err: any) {
      showNotification(
        "error",
        err?.data?.message || "Failed to remove member account."
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
            <Users className="w-8 h-8 text-primary shrink-0" />
            Institutional Member Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage student registrations, reader memberships, staff librarian privileges, and access credentials.
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
            <UserPlus className="w-4 h-4" />
            Onboard Member
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Accounts
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Registered directory profiles</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Members
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.members}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Students & general borrowers</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Staff Librarians
            </CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.librarians}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Administrative controllers</p>
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
                placeholder="Search member by name or email address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            <div className="flex items-center gap-2 sm:w-56">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Roles</option>
                <option value="member">Member (Student / Borrower)</option>
                <option value="librarian">Librarian (Admin)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-border/70 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Institutional Directory</CardTitle>
            <CardDescription className="text-xs">
              Showing {filteredUsers.length} of {users.length} registered profiles
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm font-medium">Fetching directory from backend...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-base mb-1">No Profiles Found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                {searchTerm || selectedRole !== "all"
                  ? "No members match your active search filters. Try adjusting your query."
                  : "No member accounts exist yet. Onboard the first member to get started."}
              </p>
              <Button onClick={handleOpenAdd} size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Onboard First Member
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="w-[60px]">Avatar</TableHead>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((member) => {
                  const isCurrent =
                    currentUser &&
                    (currentUser._id === member._id || currentUser.email === member.email);

                  return (
                    <TableRow
                      key={member._id || member.id}
                      className="hover:bg-muted/30"
                    >
                      {/* Avatar */}
                      <TableCell>
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center border border-primary/20 shrink-0 overflow-hidden">
                          {member.profileImage ? (
                            <img
                              src={member.profileImage}
                              alt={member.firstName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span>{member.firstName?.charAt(0) || "U"}</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Name */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">
                            {member.firstName} {member.lastName}
                          </span>
                          {isCurrent && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold text-primary border-primary/30"
                            >
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{member.email}</span>
                        </div>
                      </TableCell>

                      {/* Role Badge */}
                      <TableCell>
                        <Badge
                          variant={member.role === "librarian" ? "default" : "secondary"}
                          className="font-medium gap-1 text-xs capitalize"
                        >
                          {member.role === "librarian" ? (
                            <Shield className="w-3 h-3 text-primary-foreground" />
                          ) : (
                            <GraduationCap className="w-3 h-3 text-muted-foreground" />
                          )}
                          {member.role === "librarian" ? "Librarian (Admin)" : "Member"}
                        </Badge>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {member.createdAt
                              ? new Date(member.createdAt).toLocaleDateString()
                              : "Verified"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenView(member)}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            title="View Profile Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={Boolean(isCurrent)}
                            onClick={() => handleOpenDelete(member)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 disabled:hover:bg-transparent"
                            title={isCurrent ? "Cannot delete self" : "Delete Member"}
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

      {/* ================= ONBOARD MEMBER DIALOG ================= */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {createdCredentials ? (
            <div className="space-y-4 py-2">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  Account Successfully Provisioned
                </DialogTitle>
                <DialogDescription>
                  Provide these credentials to the user for their initial portal sign-in.
                </DialogDescription>
              </DialogHeader>

              <div className="bg-muted p-4 rounded-xl space-y-2 border border-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Email:</span>
                  <span className="font-mono font-bold text-foreground">
                    {createdCredentials.email}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Initial Password:</span>
                  <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {createdCredentials.temporaryPassword}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 text-xs flex items-start gap-2">
                <Key className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  The user can authenticate with these credentials immediately at{" "}
                  <strong>/login</strong> and update their password under their profile settings.
                </span>
              </div>

              <DialogFooter>
                <Button onClick={() => setIsAddOpen(false)}>Done</Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  Onboard Institutional Member
                </DialogTitle>
                <DialogDescription>
                  Provision an authorized library borrower account or assign administrative staff privileges.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      First Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Alex"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Last Name *
                    </label>
                    <Input
                      required
                      placeholder="e.g. Mercer"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Institutional Email *
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="e.g. alex.mercer@university.edu"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Access Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "member" | "librarian",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="member">Member (Student / General Borrower)</option>
                    <option value="librarian">Librarian (Admin Console Access)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Profile Avatar URL (Optional)
                  </label>
                  <Input
                    placeholder="https://images.unsplash.com/..."
                    value={formData.profileImage}
                    onChange={(e) =>
                      setFormData({ ...formData, profileImage: e.target.value })
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
                      Provisioning...
                    </>
                  ) : (
                    "Provision Member"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ================= VIEW PROFILE DIALOG ================= */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Member Profile Dossier
            </DialogTitle>
          </DialogHeader>

          {activeUser && (
            <div className="space-y-4 py-3">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xl shrink-0 overflow-hidden border">
                  {activeUser.profileImage ? (
                    <img
                      src={activeUser.profileImage}
                      alt={activeUser.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{activeUser.firstName?.charAt(0) || "U"}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    {activeUser.firstName} {activeUser.lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {activeUser.email}
                  </p>
                  <Badge
                    variant={activeUser.role === "librarian" ? "default" : "secondary"}
                    className="mt-2 text-[10px] font-semibold uppercase"
                  >
                    {activeUser.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-border/70">
                  <span className="text-muted-foreground">Internal Database ID:</span>
                  <span className="font-mono text-foreground font-medium">
                    {activeUser._id || activeUser.id}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/70">
                  <span className="text-muted-foreground">Account Status:</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Active / Standing Good
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Registered Since:</span>
                  <span className="font-medium text-foreground">
                    {activeUser.createdAt
                      ? new Date(activeUser.createdAt).toLocaleDateString()
                      : "Verified"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= DELETE CONFIRMATION DIALOG ================= */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Revoke Member Account
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to permanently delete the profile for{" "}
              <strong className="text-foreground">
                "{activeUser?.firstName} {activeUser?.lastName}"
              </strong>{" "}
              ({activeUser?.email})? All active privileges will be immediately revoked.
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
                  Revoking...
                </>
              ) : (
                "Confirm Revocation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStudents;