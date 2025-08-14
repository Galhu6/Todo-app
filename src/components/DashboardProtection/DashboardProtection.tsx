import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

export const DashboardProtection = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};
