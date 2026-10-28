import styles from "./TaskDetailsModal.module.css";

import { useRef, type CSSProperties } from "react";
import { useTaskDetailsModal } from "./useTaskDetailsModal";
import { useColumn } from "@hooks/useColumn";
import { NAVBAR_HEIGHT } from "@/constants/layout";

import { ListSelector } from "./components/ListSelector/ListSelector";
import { ActionBar } from "./components/ActionBar/ActionBar";
import { Title } from "./components/Title/Title";
import { Tags } from "./components/Tags/Tags";
import { DueDate } from "./components/DueDate/DueDate";
import { Description } from "./components/Description/Description";
import { Modal } from "@components/atoms/Modal/Modal";

import type { components } from "@/types/open-api-schema";
type TaskSubschema = components["schemas"]["CardSubschema"];

export interface TaskDetailsModalProps {
	onClose: () => void;
	task: TaskSubschema;
	className?: string;
}

export const TaskDetailsModal = ({
	onClose,
	task,
}: TaskDetailsModalProps) => {
	const column = useColumn();
	const modalRef = useRef<HTMLDialogElement | null>(null);

	const {
		isLoading,
		name,
		description,
		elementMaxHeight,
		handleCheck,
		handleNameChange,
		saveName,
		handleDescriptionChange,
		saveDescription,
	} = useTaskDetailsModal(task, modalRef);

	const modalStyle = {
		["--modal-item-max-height"]: `${elementMaxHeight}px`,
		["--navbar-height"]: `${NAVBAR_HEIGHT}px`,
	} as CSSProperties;

	return (
		<Modal
			onClose={onClose}
			ref={modalRef}
			className={styles["modal"]}
			style={modalStyle}
		>
			<header className={styles["header"]}>
				<ListSelector name={column.name} />

				<ActionBar onClose={onClose} task={task} />
			</header>

			<main className={styles["main"]}>
				<section className={styles["section"]}>
					<Title
						checked={task.is_done}
						onCheck={handleCheck}
						isCheckDisabled={isLoading}
						title={name}
						onChange={handleNameChange}
						onBlur={saveName}
						className={styles["leftItem"]}
					/>
				</section>

				<section className={styles["section"]}>
					<Tags task={task} />

					<DueDate task={task} />

					<Description
						description={description}
						onChange={handleDescriptionChange}
						onBlur={saveDescription}
						iconWrapperClassName={styles["leftItem"]}
					/>
				</section>
			</main>
		</Modal>
	);
};
