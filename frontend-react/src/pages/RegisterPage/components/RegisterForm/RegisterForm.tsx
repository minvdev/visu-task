import styles from "./RegisterForm.module.css";

import {
	type ComponentPropsWithRef,
	type ChangeEvent,
	type SubmitEvent,
	useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext/AuthProvider";

import { Heading } from "@atoms/HeadingV2/Heading";
import { Input } from "@atoms/InputV2/Input";
import { FormField } from "@molecules/FormField/FormField";
import { Button } from "@atoms/Button/Button";
import { Error } from "@components/atoms/Error/Error";
import { RegisterFormError } from "@/types/auth";

export interface RegisterFormProps extends Omit<
	ComponentPropsWithRef<"form">,
	"onSubmit" | "className"
> {}

type FormData = {
	username: string;
	email: string;
	password: string;
};

export const RegisterForm = ({
	...props
}: RegisterFormProps) => {
	const navigate = useNavigate();
	const { register } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		email: "",
		username: "",
		password: "",
	});
	const [error, setError] = useState<RegisterFormError>({});

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
		try {
			setIsLoading(true);

			const result = await register(
				formData.username,
				formData.email,
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
				general: "Failed to register. Try again.",
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
					Regístrate para entrar
				</p>
				<p className={styles["subtitle"]}>
					Ya tienes una cuenta?{" "}
					<Link to="/login" className={styles["link"]}>
						Inicia Sesión
					</Link>
				</p>
			</div>

			<main className={styles["main"]}>
				{error.general && (
					<Error
						message={error.general}
						className={styles["errorAlert"]}
					/>
				)}

				<div className={styles["fieldsContainer"]}>
					<FormField
						label="Email"
						htmlFor="email"
						error={error.email}
					>
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

					<FormField
						label="Usuario"
						htmlFor="username"
						error={error.username}
					>
						<Input
							id="username"
							name="username"
							placeholder="Introduce tu nombre de usuario"
							value={formData.username}
							onChange={handleChange}
							required
						/>
					</FormField>

					<FormField
						label="Contraseña"
						htmlFor="password"
						error={error.password}
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
						{isLoading ? "Entrando..." : "Regístrate"}
					</Button>
				</div>
			</main>
		</form>
	);
};
