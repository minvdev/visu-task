import styles from "./LoginForm.module.css";

import {
	type ComponentPropsWithRef,
	type ChangeEvent,
	type SubmitEvent,
	useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext/AuthProvider";
import { LoginFormError } from "@/types/auth";

import { Heading } from "@atoms/HeadingV2/Heading";
import { Input } from "@atoms/InputV2/Input";
import { Error } from "@atoms/Error/Error";
import { FormField } from "@molecules/FormField/FormField";
import { Button } from "@atoms/Button/Button";

export interface LoginFormProps extends Omit<
	ComponentPropsWithRef<"form">,
	"onSubmit" | "className"
> {}

type FormData = {
	username: string;
	password: string;
};

export const LoginForm = ({ ...props }: LoginFormProps) => {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		username: "",
		password: "",
	});
	const [error, setError] = useState<LoginFormError>({});
	const [submitCount, setSubmitCount] = useState(0);

	const handleChange = (
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const { name, value } = event.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError((prev) => ({
			...prev,
			general: undefined,
			[name]: undefined,
		}));
	};

	const handleSubmit = async (
		e: SubmitEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		setSubmitCount((prev) => prev + 1);

		try {
			setIsLoading(true);

			const result = await login(
				formData.username,
				formData.password,
			);
			if (!result.success) {
				setError(result.error);
				return;
			}

			navigate("/dashboard");
		} catch (error) {
			setError((prev) => ({
				...prev,
				general: "Unexpected error. Try again.",
			}));
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			className={styles["form"]}
			onSubmit={handleSubmit}
			{...props}
		>
			<div className={styles["header"]}>
				<Heading level={2} className={styles["noMargin"]}>
					VisuTask
				</Heading>
				<p className={styles["subtitle"]}>
					Inicia sesión para entrar
				</p>
				<p className={styles["subtitle"]}>
					No tienes una cuenta?{" "}
					<Link to="/register" className={styles["link"]}>
						Regístrate
					</Link>
				</p>
			</div>

			<main className={styles["main"]}>
				{error.general && (
					<Error
						className={styles["errorAlert"]}
						message={error.general}
						key={submitCount}
					/>
				)}

				<div className={styles["fieldsContainer"]}>
					<FormField
						label="Usuario o Email"
						htmlFor="username"
						error={error.username}
						errorKey={submitCount}
					>
						<Input
							id="username"
							name="username"
							placeholder="Introduce tu nombre de usuario o email"
							value={formData.username}
							onChange={handleChange}
							required
							autoFocus
						/>
					</FormField>

					<FormField
						label="Contraseña"
						htmlFor="password"
						error={error.password}
						errorKey={submitCount}
					>
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

				<div className={styles["actions"]}>
					<Button
						type="submit"
						disabled={isLoading}
						className={styles["submitBtn"]}
					>
						{isLoading ? "Entrando..." : "Iniciar Sesión"}
					</Button>
				</div>
			</main>
		</form>
	);
};
