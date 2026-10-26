import styles from "./CreateTaskForm.module.css";
import clsx from "clsx";

import { useCreateTaskForm } from "./useCreateTaskForm";

import { Textarea } from "@atoms/Textarea/Textarea";
import { Button } from "@atoms/Button/Button";
import { CloseButton } from "@atoms/CloseButton/CloseButton";

export interface CreateTaskFormProps {
	onClose: () => void;
	className?: string | undefined;
}

export const CreateTaskForm = ({
	onClose,
	className,
}: CreateTaskFormProps) => {
	const {
		isLoading,
		formRef,
		name,
		setName,
		handleSubmit,
	} = useCreateTaskForm(onClose);

	return (
		<form
			onSubmit={handleSubmit}
			className={clsx(styles["form"], className)}
			ref={formRef}
			autoComplete="off"
		>
			<div className={styles["task"]}>
				<Textarea
					value={name}
					onChange={(e) => {
						setName(e.target.value);
					}}
					placeholder="Introduce un título..."
					defaultStyles={false}
					id="name"
					name="name"
					autoFocus
				/>
			</div>

			<div className={styles["actions"]}>
				<Button
					className={styles["addButton"]}
					variants={["primary", "button-sm"]}
					type="submit"
					disabled={!name.trim() || isLoading}
				>
					Añadir tarjeta
				</Button>

				<CloseButton
					className={styles["closeButton"]}
					onClick={onClose}
				/>
			</div>
		</form>
	);
};
