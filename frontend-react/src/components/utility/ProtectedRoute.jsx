import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
	const { loading, isAuthenticated } = useAuth();

	if (loading) return;

	if (!isAuthenticated)
		return <Navigate to="/login" replace />;

	return <div>{children}</div>;
};
