import styles from "./ButtonBase.module.css";
import clsx from "clsx";

import { type ComponentPropsWithRef } from "react";
export interface ButtonBaseProps extends ComponentPropsWithRef<"button"> {
	size?: number;
}

export const ButtonBase = ({
	type = "button",
	disabled = false,
	tabIndex,
	size,
	style,
	className,
	...props
}: ButtonBaseProps) => {
	const sizeString = clsx(size && `${size}px`);

	const finalStyle = {
		...{
			["--close-width"]: sizeString || undefined,
			["--close-height"]: sizeString || undefined,
		},
		...style,
	};

	return (
		<button
			type={type}
			className={clsx(styles["buttonBase"], className)}
			disabled={disabled}
			tabIndex={disabled ? -1 : tabIndex}
			style={finalStyle}
			{...props}
		></button>
	);
};
