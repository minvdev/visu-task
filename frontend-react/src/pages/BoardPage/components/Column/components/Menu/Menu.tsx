import styles from "./Menu.module.css";
import clsx from "clsx";

import { useState, useRef, useMemo } from "react";
import { useColumnActions } from "@hooks/useColumnActions";

import { Popover } from "@atoms/Popover/Popover";
import { OptionsMenu } from "@components/molecules/OptionsMenu/OptionsMenu";
import { MenuHeader } from "@molecules/MenuHeader/MenuHeader";
import { MenuToggle } from "@molecules/MenuToggle/MenuToggle";
import type { Options } from "@components/molecules/OptionsMenu/OptionsMenu";

export interface MenuProps {
	onSelectCreateTask: () => void;
	className?: string | undefined;
}

export const Menu = ({
	onSelectCreateTask,
	className,
}: MenuProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [toggleMenu, closeMenu] = [
		() => setIsMenuOpen((prev) => !prev),
		() => setIsMenuOpen(false),
	];

	const toggleRef = useRef(null);
	const { deleteColumn } = useColumnActions();

	const options = useMemo<Options>(
		() => [
			{
				options: [
					{
						text: "Añadir tarjeta",
						action: () => {
							onSelectCreateTask();
							closeMenu();
						},
					},
				],
			},
			{
				options: [
					{
						text: "Eliminar esta lista",
						action: () => deleteColumn(),
					},
				],
			},
		],
		[],
	);

	const menu = (
		<Popover
			onClose={closeMenu}
			className={clsx(styles["popover"], className)}
			rightClass={styles["popoverLocation"]}
			bottomClass={styles["popoverLocation"]}
			ignoreElements={[toggleRef]}
		>
			<OptionsMenu options={options}>
				<MenuHeader title="Acciones" onClose={closeMenu} />
			</OptionsMenu>
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
