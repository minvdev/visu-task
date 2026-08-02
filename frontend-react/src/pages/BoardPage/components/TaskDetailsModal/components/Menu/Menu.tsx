import styles from "./Menu.module.css";
import clsx from "clsx";

import {
	useState,
	useRef,
	useCallback,
	useMemo,
} from "react";
import { useColumnActions } from "@hooks/useColumnActions";

import { Popover } from "@atoms/Popover/Popover";
import { OptionsMenu } from "@components/molecules/OptionsMenu/OptionsMenu";
import { MenuToggle } from "@molecules/MenuToggle/MenuToggle";

import type { Options } from "@components/molecules/OptionsMenu/OptionsMenu";
import type { components } from "@/types/open-api-schema";
type TaskSubschema = components["schemas"]["CardSubschema"];

export interface MenuProps {
	task: TaskSubschema;
	className?: string | undefined;
}

export const Menu = ({ task, className }: MenuProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [toggleMenu, closeMenu] = [
		() => setIsMenuOpen((prev) => !prev),
		() => setIsMenuOpen(false),
	];

	const toggleRef = useRef(null);
	const { deleteTask } = useColumnActions();

	const handleTaskDelete = useCallback(async () => {
		try {
			setIsLoading(true);
			await deleteTask(task.id);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const options = useMemo<Options>(
		() => [
			{
				options: [
					{
						text: "Eliminar tarea",
						action: handleTaskDelete,
						disabled: isLoading,
					},
				],
			},
		],
		[isLoading],
	);

	const menu = (
		<Popover
			onClose={closeMenu}
			className={clsx(styles["popover"], className)}
			rightClass={styles["popoverLocation"]}
			bottomClass={styles["popoverLocation"]}
			ignoreElements={[toggleRef]}
		>
			<OptionsMenu options={options} />
		</Popover>
	);

	return (
		<MenuToggle
			ref={toggleRef}
			isOpen={isMenuOpen}
			onClick={toggleMenu}
			menu={menu}
		/>
	);
};
