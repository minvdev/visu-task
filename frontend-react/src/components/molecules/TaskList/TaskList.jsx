import styles from "./TaskList.module.css";
import clsx from "clsx";

import { useState } from "react";

import { Task } from "../../atoms/Task/Task";
import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { EditableText } from "../EditableText/EditableText";
import { ButtonBase } from "../../atoms/ButtonBase/ButtonBase";

import { EditIcon } from "../../../assets/icons/EditIcon/EditIcon";

export const TaskList = ({
	className,
	tasks = [],
	onTaskUpdate,
	onTaskEdit,
}) => {
	const [editingId, setEditingId] = useState(null);
	const [showTagDetail, setShowTagDetail] = useState(false);

	const handleToggleCheckbox = (id, is_done) => (e) => {
		e.stopPropagation();
		onTaskUpdate(id, { is_done });
	};

	const handleTaskTextEdit = (id) => (name) => {
		onTaskUpdate(id, { name });
	};

	const handleEditRequest = (id) => () => {
		onTaskEdit(id);
	};

	const handleEditClick = (id) => (e) => {
		e.stopPropagation();
		setEditingId(id);
	};

	const handleTagClick = (e) => {
		e.stopPropagation();
		setShowTagDetail(!showTagDetail);
	};

	if (!tasks) return;

	return (
		<div className={clsx(className, styles.taskList)}>
			{tasks
				.sort((a, b) => a.position - b.position)
				.map((task) => (
					<Task
						key={task.id}
						className={styles.task}
						onClick={handleEditRequest(task.id)}
					>
						{task.tags && task.tags.length > 0 && (
							<div className={styles.tagsContainer}>
								{task.tags.map((tag) => (
									<div
										style={{ backgroundColor: tag.color }}
										className={clsx(
											styles.tag,
											showTagDetail && styles.detailedTag,
										)}
										key={tag.id}
										onClick={handleTagClick}
									>
										<span className={styles.tagText}>
											{showTagDetail &&
												tag.name &&
												tag.name}
										</span>
									</div>
								))}
							</div>
						)}

						<ButtonBase
							onClick={handleEditClick(task.id)}
							className={styles.editBtn}
						>
							<EditIcon />
						</ButtonBase>

						<div className={styles.textContainer}>
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
								isEditing={editingId === task.id}
								onRequestEdit={handleEditRequest(task.id)}
								onEditingChange={(val) => {
									if (!val) setEditingId(null);
								}}
							>
								{task.name}
							</EditableText>
						</div>
					</Task>
				))}
		</div>
	);
};
