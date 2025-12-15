import styles from "./LoginPage.module.css";
import { LoginForm } from "../../components/organisms/LoginForm/LoginForm";
import { apiFetch } from "../../services/api";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (credentials) => {
		setIsLoading(true);
		setError(null);

		const formData = new FormData();
		formData.append("username", credentials.username);
		formData.append("password", credentials.password);

		try {
			const data = await apiFetch("/auth/login", {
				method: "POST",
				body: formData,
			});

			await login(data.access_token);
			navigate("/dashboard");
		} catch (error) {
			console.log(error);
			setError(
				error.message || "Error al conectar con el servidor"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.pageContainer}>
			<LoginForm
				onSubmit={handleSubmit}
				isLoading={isLoading}
				error={error}
			></LoginForm>
		</div>
	);
};
