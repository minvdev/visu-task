import styles from "./RegisterForm.module.css";
import { Heading } from "../../atoms/Heading/Heading";
import { Input } from "../../atoms/Input/Input";
import { FormField } from "../../molecules/FormField/FormField";
import { Button } from "../../atoms/Button/Button";
import { useState } from "react";
import { Link } from "react-router-dom";

export const RegisterForm = ({
	onSubmit,
	isLoading,
	error,
}) => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		password: "",
	});

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isLoading) return;
		onSubmit(formData);
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit}>
			<div className={styles.header}>
				<Heading level={2} variants={["noMargin"]}>
					VisuTask
				</Heading>
				<p className={styles.subtitle}>
					Regístrate para entrar
				</p>
				<p className={styles.subtitle}>
					Ya tienes una cuenta?{" "}
					<Link to="/login" className={styles.link}>
						Inicia Sesión
					</Link>
				</p>
			</div>

			{error && (
				<div className={styles.errorAlert}>{error}</div>
			)}

			<div className={styles.fieldsContainer}>
				<FormField label="Email" htmlFor="email">
					<Input
						id="email"
						name="email"
						placeholder="Introduce tu email"
						value={formData.email}
						onChange={handleChange}
						required
						autoFocus
					/>
				</FormField>

				<FormField label="Usuario" htmlFor="username">
					<Input
						id="username"
						name="username"
						placeholder="Introduce tu nombre de usuario"
						value={formData.username}
						onChange={handleChange}
						required
					/>
				</FormField>

				<FormField label="Contraseña" htmlFor="password">
					<Input
						id="password"
						name="password"
						placeholder="••••••••"
						value={formData.password}
						onChange={handleChange}
						required
					/>
				</FormField>
			</div>

			<div className={styles.actions}>
				<Button
					type="submit"
					disabled={isLoading}
					className={styles.submitBtn}
				>
					{isLoading ? "Entrando..." : "Regístrate"}
				</Button>
			</div>
		</form>
	);
};
