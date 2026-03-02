import styles from "./TaskList.module.css";
import clsx from "clsx";

import { Task } from "../../atoms/Task/Task";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { EditableText } from "../EditableText/EditableText";
import { ButtonBase } from "../../atoms/ButtonBase/ButtonBase";

import { EditIcon } from "../../../assets/icons/EditIcon/EditIcon";

export const TaskList = ({
	className,
	tasks = [],
	onTaskUpdate,
	onTaskDelete,
	onTaskEdit,
}) => {
	const handleToggleCheckbox = (id, is_done) => () => {
		onTaskUpdate(id, { is_done });
	};

	const handleTaskTextEdit = (id) => (name) => {
		onTaskUpdate(id, { name });
	};

	if (!tasks) return;

	return (
		<div className={clsx(className, styles.taskList)}>
			{tasks
				.sort((a, b) => a.position - b.position)
				.map((task) => (
					<Task key={task.id} className={styles.task}>
						<Checkbox
							className={clsx(
								styles.checkbox,
								task?.is_done && styles.checked,
							)}
							checked={task?.is_done || false}
							onChange={handleToggleCheckbox(
								task.id,
								!task.is_done,
							)}
						/>
						<EditableText
							component={"p"}
							className={clsx(
								styles.taskText,
								task?.is_done && styles.checked,
							)}
							inputName={`taskInput${task.id}`}
							onSave={handleTaskTextEdit(task.id)}
							multiline={true}
							maxInputLength={100}
						>
							{task.name}
						</EditableText>

						<ButtonBase
							onClick={() => onTaskEdit(task.id)}
							className={styles.editBtn}
						>
							<EditIcon />
						</ButtonBase>
					</Task>
				))}
		</div>
	);
};
