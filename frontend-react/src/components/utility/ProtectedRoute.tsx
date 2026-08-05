import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext/AuthProvider";

export const ProtectedRoute = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { isLoading, user } = useAuth();

	if (isLoading) return <div>Cargando...</div>;

	return user ? children : <Navigate to="/login" replace />;
};
