import styles from "./CreateColumnForm.module.css";
import clsx from "clsx";

import {
	useState,
	type RefObject,
	type SubmitEvent,
} from "react";

import { Input } from "@atoms/InputV2/Input";
import { Button } from "@atoms/Button/Button";
import { CloseButton } from "@atoms/CloseButton/CloseButton";
import { useBoardActions } from "@hooks/useBoardActions";

export interface CreateColumnFormProps {
	ref: RefObject<HTMLFormElement | null>;
	onClose: () => void;
	className?: string | undefined;
}

export const CreateColumnForm = ({
	ref,
	onClose,
	className,
}: CreateColumnFormProps) => {
	const [name, setName] = useState("");
	const { createColumn } = useBoardActions();

	const handleSubmit = async (
		e: SubmitEvent<HTMLFormElement>,
	) => {
		e.preventDefault();
		try {
			await createColumn({ name });
			setName("");
			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={clsx(styles["form"], className)}
			ref={ref}
		>
			<Input
				className={styles["input"]}
				id="name"
				name="name"
				placeholder="Introduce el nombre de la lista..."
				autoFocus
				value={name}
				onChange={(e) => {
					setName(e.target.value);
				}}
			/>
			<div className={styles["actions"]}>
				<Button
					variants={["primary", "button-sm"]}
					type="submit"
					disabled={!name.trim()}
				>
					Añadir lista
				</Button>

				<CloseButton
					onClick={onClose}
					size={32}
					// className={styles["close"]}
				/>
			</div>
		</form>
	);
};
