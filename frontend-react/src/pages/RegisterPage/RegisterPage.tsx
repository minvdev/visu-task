import styles from "./RegisterPage.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@services/auth";

import { RegisterForm } from "@organisms/RegisterForm/RegisterForm";

export const RegisterPage = () => {
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (credentials: {
		username: string;
		email: string;
		password: string;
	}) => {
		setIsLoading(true);
		setError(null);
		const { username, email, password } = credentials;

		try {
			await authService.register({
				username,
				email,
				password,
			});
			navigate("/login");
		} catch (error) {
			console.log(error);
			setError(
				error.message ||
					"Error al conectar con el servidor",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles["pageContainer"]}>
			<RegisterForm
				onSubmit={handleSubmit}
				isLoading={isLoading}
				error={error}
			></RegisterForm>
		</div>
	);
};
