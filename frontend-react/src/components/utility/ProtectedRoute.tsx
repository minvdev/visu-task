import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";

export const ProtectedRoute = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { loading, isAuthenticated } = useAuth();

	if (loading) return <div>Cargando...</div>;

	return isAuthenticated ? (
		children
	) : (
		<Navigate to="/login" replace />
	);
};
