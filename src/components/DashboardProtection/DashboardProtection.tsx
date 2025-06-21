import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export const DashboardProtection = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

