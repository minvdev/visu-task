import styles from "./TaskRenameModal.module.css";
import clsx from "clsx";

import { useTaskRenameModal } from "./useTaskRenameModal";

import { Modal } from "@components/atoms/Modal/Modal";
import { TaskTags } from "@pages/BoardPage/components/TaskTags/TaskTags";
import { Textarea } from "@atoms/Textarea/Textarea";
import { DueDate } from "@atoms/DueDate/DueDate";
import { Button } from "@atoms/Button/Button";

import { TaskProps } from "../Task/Task";
type Task = TaskProps["task"];

export interface TaskRenameModalProps {
	onClose: () => void;
	task: Task;
	cardDimensions: DOMRect;
	isCompactTags: boolean;
	onTagClick: () => void;
	className?: string;
}

export const TaskRenameModal = ({
	onClose,
	task,
	cardDimensions,
	isCompactTags,
	onTagClick,
	className,
}: TaskRenameModalProps) => {
	const { name, isLoading, handleChange, handleSubmit } =
		useTaskRenameModal(task, onClose);

	return (
		<Modal
			onClose={onClose}
			className={clsx(styles["modal"], className)}
			style={{
				top: `${cardDimensions.top}px`,
				left: `${cardDimensions.left}px`,
			}}
		>
			<div>
				<div
					className={styles["card"]}
					style={{
						width: `${cardDimensions.width}px`,
					}}
				>
					{task.tags.length > 0 && (
						<TaskTags
							isCompactTags={isCompactTags}
							onClickTag={onTagClick}
							tags={task.tags}
							className={clsx(styles["tags"])}
						/>
					)}

					<Textarea
						value={name}
						onChange={handleChange}
						onFocus={(e) => e.target.select()}
						defaultStyles={false}
						className={styles["textArea"]}
					/>

					{task.due_date && (
						<DueDate
							due_date={task.due_date}
							is_done={task.is_done}
							className={clsx(styles["date"])}
						/>
					)}
				</div>

				<Button
					onClick={handleSubmit}
					disabled={isLoading || !name}
					variants={["primary", "button-md"]}
					className={clsx(styles["submitBtn"])}
				>
					Guardar
				</Button>
			</div>
		</Modal>
	);
};
