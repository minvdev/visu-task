import styles from "./MenuToggle.module.css";
import clsx from "clsx";

import {
	type ComponentPropsWithRef,
	type ReactNode,
	type MouseEvent,
} from "react";

import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { LucideEllipsis } from "lucide-react";

export interface BoardMenuToggleProps extends Omit<
	ComponentPropsWithRef<"div">,
	"onClick"
> {
	menu: ReactNode;
	isOpen: boolean;
	onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const MenuToggle = ({
	menu,
	isOpen,
	onClick,
	className,
	...props
}: BoardMenuToggleProps) => {
	return (
		<div
			className={clsx(styles["container"], className)}
			{...props}
		>
			<ButtonBase
				className={clsx(
					styles["toggle"],
					isOpen && styles["active"],
				)}
				onClick={onClick}
			>
				<LucideEllipsis />
			</ButtonBase>

			{isOpen && menu}
		</div>
	);
};
