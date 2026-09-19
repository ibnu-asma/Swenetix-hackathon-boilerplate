import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

function EntryRedirect() {
  const { user, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "student") {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Navigate to="/admin/dashboard" replace />;
}

export default EntryRedirect;