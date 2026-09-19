import { createBrowserRouter, Outlet } from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import AuthLayout from "../layouts/AuthLayout";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminBooks from "../pages/admin/Books";
import AdminStudents from "../pages/admin/Students";
import AdminBorrowings from "../pages/admin/Borrowings";
import AdminAnalytics from "../pages/admin/Analytics";

// import StudentDashboard from "../pages/student/dashboard";
// import StudentBooks from "../pages/student/Books";
// import BookDetails from "../pages/student/BookDetails";
// import MyBooks from "../pages/student/";
// import History from "../pages/student/History";
// import StudentAI from "../pages/student/AI";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
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

  // {
  //   path: "/student",
  //   element: <StudentLayout />,
  //   children: [
  //     {
  //       path: "dashboard",
  //       element: <StudentDashboard />,
  //     },
  //     {
  //       path: "books",
  //       element: <StudentBooks />,
  //     },
  //     {
  //       path: "books/:id",
  //       element: <BookDetails />,
  //     },
  //     {
  //       path: "my-books",
  //       element: <MyBooks />,
  //     },
  //     {
  //       path: "history",
  //       element: <History />,
  //     },
  //     {
  //       path: "ai",
  //       element: <StudentAI />,
  //     },
  //   ],
  // },
]);