import styles from "./CreateTaskForm.module.css";
import clsx from "clsx";

import { useState, useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";

export const CreateTaskForm = ({
	onSubmit,
	onCancel,
	className,
}) => {
	const [name, setName] = useState("");
	const formRef = useRef();
	useClickOutside(formRef, onCancel);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		onSubmit({ name });
		setName("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={clsx(styles.form, className)}
			ref={formRef}
		>
			<Input
				className={styles.input}
				id="name"
				name="name"
				placeholder="Introduce un título..."
				autoFocus
				value={name}
				onChange={(e) => {
					setName(e.target.value);
				}}
			/>
			<div className={styles.actions}>
				<Button
					variants={["primary", "button-sm"]}
					type="submit"
					disabled={!name.trim()}
				>
					Añadir tarjeta
				</Button>

				<Button
					variants={["danger", "button-sm"]}
					type="button"
					onClick={onCancel}
				>
					Cancelar
				</Button>
			</div>
		</form>
	);
};
