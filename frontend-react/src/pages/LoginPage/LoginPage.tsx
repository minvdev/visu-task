import styles from "./LoginPage.module.css";

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { authService } from "@services/auth";

import { LoginForm } from "@organisms/LoginForm/LoginForm";

export const LoginPage = () => {
	const navigate = useNavigate();
	const { login, isAuthenticated } = useAuth();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (credentials: {
		username: string;
		password: string;
	}) => {
		setIsLoading(true);
		setError(null);

		const { data, error } = await authService.login({
			username: credentials.username,
			password: credentials.password,
		});

		if (error) {
			setError("Usuario o contraseña incorrectos");
			setIsLoading(false);
			return;
		}

		await login(data.access_token);
		navigate("/dashboard");
		setIsLoading(false);
	};

	if (isAuthenticated) return <Navigate to="/" />;

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
