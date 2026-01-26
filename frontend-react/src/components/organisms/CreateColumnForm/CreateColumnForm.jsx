import styles from "./CreateColumnForm.module.css";
import clsx from "clsx";

import { useState, useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

import { Input } from "../../atoms/Input/Input";
import { Button } from "../../atoms/Button/Button";
import { ButtonBase } from "../../atoms/ButtonBase/ButtonBase";

import { CancelIcon } from "../../../assets/icons/CancelIcon/CancelIcon";

export const CreateColumnForm = ({
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
		onSubmit(name);
		setName("");
		onCancel();
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
				placeholder="Introduce el nombre de la lista..."
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
					Añadir lista
				</Button>

				<ButtonBase
					onClick={onCancel}
					className={styles.cancelBtn}
				>
					<CancelIcon className={styles.cancelIcon} />
				</ButtonBase>
			</div>
		</form>
	);
};
