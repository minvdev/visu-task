import styles from "./Column.module.css";
import clsx from "clsx";

import { useState, useRef } from "react";

import { EditableText } from "../../molecules/EditableText/EditableText";
import { Heading } from "../../atoms/Heading/Heading";
import { Toggle } from "../../atoms/Toggle/Toggle";
import { Popover } from "../../atoms/Popover/Popover";
import { OptionMenu } from "../OptionMenu/OptionMenu";
import { TaskList } from "../../molecules/TaskList/TaskList";
import { CreateTaskForm } from "../CreateTaskForm/CreateTaskForm";
import { ButtonBase } from "../../atoms/ButtonBase/ButtonBase";
import { Task } from "../../atoms/Task/Task";

import { ThreeDotsIcon } from "../../../assets/icons/ThreeDotsIcon/ThreeDotsIcon";
import { PlusIcon } from "../../../assets/icons/PlusIcon/PlusIcon";

export const Column = ({
	className,
	id,
	columnTasks = [],
	onColumnUpdate,
	onColumnDelete,
	onTaskCreate,
	onTaskUpdate,
	onTaskDelete,
	onTaskEdit,
	children,
}) => {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [isCreateTaskFormOpen, setIsCreateTaskFormOpen] =
		useState(false);
	const toggleRef = useRef(null);

	const closeMenu = () => {
		if (isPopoverOpen) setIsPopoverOpen(false);
	};

	const handleTriggerCreateTask = () => {
		setIsCreateTaskFormOpen(true);
		closeMenu();
	};

	const menuOptions = [
		{
			options: [
				{
					label: "Añadir tarjeta",
					onClick: handleTriggerCreateTask,
				},
			],
		},
		{
			options: [
				{
					label: "Eliminar esta lista",
					onClick: () => onColumnDelete(id),
				},
			],
		},
	];

	return (
		<div className={clsx(className, styles.column)}>
			<div className={styles.tab}>
				<EditableText
					multiline={true}
					inputName={`columnInput${id}`}
					onSave={(name) => onColumnUpdate(id, { name })}
				>
					<Heading level={5} className={styles.heading}>
						{children}
					</Heading>
				</EditableText>

				<div className={styles.toggleContainer}>
					<Toggle
						className={clsx(
							styles.optionsToggler,
							isPopoverOpen && styles.optionsTogglerActive,
						)}
						onToggleOn={() => setIsPopoverOpen(true)}
						onToggleOff={() => setIsPopoverOpen(false)}
						isToggled={isPopoverOpen}
						ref={toggleRef}
					>
						<ThreeDotsIcon className={styles.optionsIcon} />
					</Toggle>

					{isPopoverOpen && (
						<Popover
							onClose={() => setIsPopoverOpen(false)}
							className={styles.popover}
							rightClass={styles.popoverRight}
							bottomClass={styles.popoverBottom}
							ignoreElements={[toggleRef]}
						>
							<OptionMenu
								heading={
									<Heading level={4}>Acciones</Heading>
								}
								options={menuOptions}
							/>
						</Popover>
					)}
				</div>
			</div>

			<div className={styles.content}>
				<TaskList
					tasks={columnTasks}
					onTaskUpdate={(taskId, body) =>
						onTaskUpdate(id, taskId, body)
					}
					onTaskDelete={(taskId) =>
						onTaskDelete(id, taskId)
					}
					onTaskEdit={(taskId) => onTaskEdit(id, taskId)}
				/>

				{isCreateTaskFormOpen ? (
					<CreateTaskForm
						onSubmit={(body) => onTaskCreate(id, body)}
						onCancel={() => setIsCreateTaskFormOpen(false)}
					/>
				) : (
					<ButtonBase onClick={handleTriggerCreateTask}>
						<Task
							className={clsx(styles.addTask)}
							isAddTaskVariant={true}
						>
							<div className={styles.wrapper}>
								<PlusIcon />
								<span>Añade una tarjeta</span>
							</div>
						</Task>
					</ButtonBase>
				)}
			</div>
		</div>
	);
};
