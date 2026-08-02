import styles from "./AddTask.module.css";

import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { CreateTaskForm } from "../CreateTaskForm/CreateTaskForm";
import { LucidePlus } from "lucide-react";

export interface AddTaskProps {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const AddTask = ({
	isOpen,
	onOpen,
	onClose,
}: AddTaskProps) => {
	return isOpen ? (
		<CreateTaskForm onClose={onClose} />
	) : (
		<ButtonBase onClick={onOpen} className={styles["card"]}>
			<LucidePlus strokeWidth="1.2" />
			Añade una tarjeta
		</ButtonBase>
	);
};
