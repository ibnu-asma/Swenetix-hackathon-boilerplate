import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import { StudentLayout } from "../layouts/StudentLayout";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminBooks from "../pages/admin/Books";
import AdminStudents from "../pages/admin/Students";
import AdminBorrowings from "../pages/admin/Borrowings";
import AdminAnalytics from "../pages/admin/Analytics";

import { Dashboard as StudentDashboard } from "../pages/student/dashboard";
import { Books as StudentBooks } from "../pages/student/Books";
import { BookDetails } from "../pages/student/BookDetails";
import { MyBooks } from "../pages/student/MyBooks";
import { BorrowingHistory } from "../pages/student/BorrowingHistory";
import { Reservations } from "../pages/student/Reservations";
import { Profile } from "../pages/student/profile";
import { Notifications } from "../pages/student/notifications";

import EntryRedirect from "../pages/EntryRedirect";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <EntryRedirect />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  // ADMIN ROUTES (Protected for Admin only)
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/books" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "books",
        element: <AdminBooks />,
      },
      {
        path: "students",
        element: <AdminStudents />,
      },
      {
        path: "borrowings",
        element: <AdminBorrowings />,
      },
      {
        path: "analytics",
        element: <AdminAnalytics />,
      },
    ],
  },

  // MEMBER ROUTES (Protected for Member and Admin)
  {
    path: "/member",
    element: (
      <ProtectedRoute allowedRoles={["member", "admin"]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/member/dashboard" replace />,
      },
      { path: "dashboard", element: <StudentDashboard /> },
      { path: "books", element: <StudentBooks /> },
      { path: "books/:id", element: <BookDetails /> },
      { path: "my-books", element: <MyBooks /> },
      { path: "history", element: <BorrowingHistory /> },
      { path: "reservations", element: <Reservations /> },
      { path: "profile", element: <Profile /> },
      { path: "notifications", element: <Notifications /> },
    ],
  },

  // STUDENT ROUTES (Backward compatibility alias to member views)
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={["member", "admin"]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/student/dashboard" replace />,
      },
      { path: "dashboard", element: <StudentDashboard /> },
      { path: "books", element: <StudentBooks /> },
      { path: "books/:id", element: <BookDetails /> },
      { path: "my-books", element: <MyBooks /> },
      { path: "history", element: <BorrowingHistory /> },
      { path: "reservations", element: <Reservations /> },
      { path: "profile", element: <Profile /> },
      { path: "notifications", element: <Notifications /> },
    ],
  },

  // Catch-all
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
