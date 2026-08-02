import styles from "./Column.module.css";
import clsx from "clsx";

import { useState } from "react";
import { useColumn } from "@hooks/useColumn";
import { useColumnActions } from "@hooks/useColumnActions";

import { AddTask } from "./components/AddTask/AddTask";
import { Menu } from "./components/Menu/Menu";
import { EditableText } from "@components/molecules/EditableText/EditableText";
import { Task } from "@pages/BoardPage/components/Task/Task";

export interface ColumnProps {
	className?: string | undefined;
	isCompactTags: boolean;
	onTagClick: () => void;
}

export const Column = ({
	isCompactTags,
	onTagClick,
	className,
}: ColumnProps) => {
	const column = useColumn();
	const { updateColumn } = useColumnActions();
	const [name, setName] = useState(column.name);
	const [isCreatingTask, setIsCreatingTask] =
		useState(false);

	return (
		<div className={clsx(styles["container"], className)}>
			<header className={styles["header"]}>
				<EditableText
					as="h2"
					value={name}
					onChange={(value) => setName(value)}
					onBlur={(value) => updateColumn({ name: value })}
					onFocus={(e) => e.target?.select()}
					name="column-name"
					multiline={true}
					className={styles["heading"]}
				/>

				<Menu
					onSelectCreateTask={() => setIsCreatingTask(true)}
				/>
			</header>

			<section className={styles["content"]}>
				{column.cards.map((card) => (
					<Task
						key={card.id}
						task={card}
						isCompactTags={isCompactTags}
						onTagClick={onTagClick}
					/>
				))}
			</section>

			<footer className={styles["footer"]}>
				<AddTask
					isOpen={isCreatingTask}
					onOpen={() => setIsCreatingTask(true)}
					onClose={() => setIsCreatingTask(false)}
				/>
			</footer>
		</div>
	);
};
