import styles from "./LoginView.module.css";
import { Button } from "../components/atoms/Button/Button";
import { Input } from "../components/atoms/Input/Input";
import { Select } from "../components/atoms/Select/Select";
import { Label } from "../components/atoms/Label/Label";
import { Heading } from "../components/atoms/Heading/Heading";

import { useState } from "react";

function LoginView() {
	const [inputValue, setInputValue] = useState("");

	return (
		<div className={styles.container}>
			<Heading level="2">Login</Heading>

			<div className={styles.molecule}>
				<Select
					placeholder="Selecciona algo caralmendra"
					value={inputValue}
					options={[
						{ label: "Primera opción", value: "1" },
						{ label: "Segunda opción", value: "2" },
						{ label: "Tercera opción", value: "3" },
						{ label: "Cuarta opción", value: "4" },
					]}
					onChange={(event) =>
						setInputValue(event.target.value)
					}
				/>
			</div>

			<div className={styles.molecule}>
				<Label for_="userInput">Usuario</Label>
				<Input
					id="userInput"
					placeholder="Introduce tu usuario"
				/>
			</div>

			<div className={styles.molecule}>
				<Label for_="passwordInput">Contraseña</Label>
				<Input
					id="passwordInput"
					placeholder="Introduce tu contraseña"
				/>
			</div>

			<Button>Continuar</Button>
		</div>
	);
}

export default LoginView;
