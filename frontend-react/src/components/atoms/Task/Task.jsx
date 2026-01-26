import styles from "./Task.module.css";
import clsx from "clsx";

export const Task = ({
	className,
	children,
	style,
	isAddTaskVariant = false,
}) => {
	return (
		<div
			className={clsx(
				className,
				styles.task,
				isAddTaskVariant && styles.addTaskVariant
			)}
			style={style}
		>
			{children}
		</div>
	);
};
