import styles from "./LoginPage.module.css";

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext/AuthProvider";

import { LoginForm } from "./components/LoginForm/LoginForm";

export const LoginPage = () => {
	const navigate = useNavigate();
	const { login, user } = useAuth();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (credentials: {
		username: string;
		password: string;
	}) => {
		setIsLoading(true);
		setError(null);

		try {
			await login(
				credentials.username,
				credentials.password,
			);
			navigate("/dashboard");
		} catch (error) {
			setError("Usuario o contraseña incorrectos");
		} finally {
			setIsLoading(false);
		}
	};

	if (user) return <Navigate to="/" />;

	return (
		<div className={styles["pageContainer"]}>
			<LoginForm
				onSubmit={handleSubmit}
				isLoading={isLoading}
				error={error}
			></LoginForm>
		</div>
	);
};
