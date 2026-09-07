import React from "react";
import { Navigate } from "react-router";
import { useIsLoggedIn, useIsAdmin } from "../commonfunction/useAuthState";

export default function AdminGuard({ children }) {
  const loggedIn = useIsLoggedIn();
  const isAdmin = useIsAdmin();

  if (!loggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
