import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext/AuthProvider";

import { RegisterForm } from "./components/RegisterForm/RegisterForm";

export const RegisterPage = () => {
	const { user } = useAuth();

	if (user) return <Navigate to="/" />;

	return <RegisterForm />;
};
