import styles from "./ButtonBase.module.css";
import clsx from "clsx";

import { type ComponentPropsWithRef } from "react";
export interface ButtonBaseProps extends ComponentPropsWithRef<"button"> {}

export const ButtonBase = ({
	type = "button",
	disabled = false,
	tabIndex,
	className,
	...props
}: ButtonBaseProps) => {
	return (
		<button
			type={type}
			className={clsx(styles["buttonBase"], className)}
			disabled={disabled}
			tabIndex={disabled ? -1 : tabIndex}
			{...props}
		></button>
	);
};
