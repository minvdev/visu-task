import styles from "./ActionBar.module.css";
import clsx from "clsx";

import { Menu } from "../Menu/Menu";
import { CloseButton } from "@atoms/CloseButton/CloseButton";

import type { components } from "@/types/open-api-schema";
type TaskSubschema = components["schemas"]["CardSubschema"];

export interface ActionBarProps {
	onClose: () => void;
	task: TaskSubschema;
	className?: string | undefined;
}

export const ActionBar = ({
	onClose,
	task,
	className,
}: ActionBarProps) => {
	return (
		<ol className={clsx(styles["container"], className)}>
			{/* Ellipsis - Menu options */}
			<li>
				<Menu task={task} />
			</li>

			{/* Cross - Close modal */}
			<li>
				<CloseButton
					onClick={onClose}
					className={styles["item"]}
				/>
			</li>
		</ol>
	);
};
