import styles from "./MenuPopover.module.css";

import { useCallback, useRef, useState } from "react";

import { Popover } from "@atoms/Popover/Popover";
import { MenuToggle } from "@molecules/MenuToggle/MenuToggle";
import { MenuHeader } from "@molecules/MenuHeader/MenuHeader";
import {
	OptionsMenu,
	type Options,
} from "@molecules/OptionsMenu/OptionsMenu";

export interface MenuPopoverProps {
	options: Options;
	title?: string;
	onBack?: () => void;
	className?: string | undefined;
}

export const MenuPopover = ({
	title,
	onBack,
	options,
	className,
}: MenuPopoverProps) => {
	const toggleRef = useRef<HTMLDivElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [toggle, close] = [
		useCallback(() => setIsOpen((prev) => !prev), []),
		useCallback(() => setIsOpen(false), []),
	];

	const menu = (
		<Popover
			onClose={close}
			ignoreElements={toggleRef}
			className={styles["popover"]}
			rightClass={styles["popoverLocation"]}
			bottomClass={styles["popoverFallbackLocation"]}
		>
			<OptionsMenu options={options} onClose={close}>
				{title && (
					<MenuHeader
						title={title}
						onClose={close}
						onBack={onBack}
					/>
				)}
			</OptionsMenu>
		</Popover>
	);

	return (
		<MenuToggle
			menu={menu}
			isOpen={isOpen}
			onClick={toggle}
			ref={toggleRef}
			className={className}
		/>
	);
};
