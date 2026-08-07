import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext/AuthProvider";

import { LoginForm } from "./components/LoginForm/LoginForm";

export const LoginPage = () => {
	const { user } = useAuth();

	if (user) return <Navigate to="/" />;

	return <LoginForm />;
};
