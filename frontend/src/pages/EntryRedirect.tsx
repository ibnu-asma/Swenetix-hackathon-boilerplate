import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

function EntryRedirect() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/books" replace />;
  }

  return <Navigate to="/member/dashboard" replace />;
}

export default EntryRedirect;