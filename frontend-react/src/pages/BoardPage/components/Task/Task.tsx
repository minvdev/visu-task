import styles from "./Task.module.css";
import clsx from "clsx";

import { ComponentPropsWithoutRef } from "react";
import { useTask } from "./useTask";

import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { Checkbox } from "@atoms/Checkbox/Checkbox";
import { DueDate } from "@atoms/DueDate/DueDate";
import { TaskTags } from "@pages/BoardPage/components/TaskTags/TaskTags";
import { TaskRenameModal } from "@pages/BoardPage/components/TaskRenameModal/TaskRenameModal";
import { TaskDetailsModal } from "@pages/BoardPage/components/TaskDetailsModal/TaskDetailsModal";
import { LucideSquarePen } from "lucide-react";

import type { ColumnState } from "@/context/ColumnContext/context";
type Task = ColumnState["cards"][number];

export interface TaskProps extends ComponentPropsWithoutRef<"div"> {
	task: Task;
	isCompactTags: boolean;
	onTagClick: () => void;
}

export const Task = ({
	task,
	isCompactTags,
	onTagClick,
	className,
	...props
}: TaskProps) => {
	const {
		taskRef,
		taskRect,
		isLoading,
		activeView,
		setActiveView,
		handleEditClick,
		handleToggleComplete,
	} = useTask(task);

	return (
		<div
			ref={taskRef}
			className={clsx(className, styles["container"])}
			onClick={() => setActiveView("show-details")}
			{...props}
		>
			<TaskTags
				isCompactTags={isCompactTags}
				onClickTag={(e) => {
					e.stopPropagation();
					onTagClick();
				}}
				tags={task.tags}
				className={clsx(styles["tags"])}
			/>

			<div
				className={clsx(
					styles["textContainer"],
					task.is_done && styles["checked"],
				)}
			>
				<Checkbox
					className={styles["checkbox"]}
					checked={task.is_done}
					onClick={handleToggleComplete}
					disabled={isLoading}
				/>
				<span className={styles["text"]}>{task.name}</span>
			</div>

			{task.due_date && (
				<DueDate
					due_date={task.due_date}
					is_done={task.is_done}
					className={clsx(styles["date"])}
				/>
			)}

			<ButtonBase
				className={styles["editButton"]}
				onClick={handleEditClick}
			>
				<LucideSquarePen />
			</ButtonBase>
			{activeView === "edit-name" && taskRect && (
				<TaskRenameModal
					onClose={() => setActiveView("none")}
					task={task}
					cardDimensions={taskRect}
					isCompactTags={isCompactTags}
					onTagClick={onTagClick}
				/>
			)}

			{activeView === "show-details" && (
				<TaskDetailsModal
					onClose={() => setActiveView("none")}
					task={task}
				/>
			)}
		</div>
	);
};
