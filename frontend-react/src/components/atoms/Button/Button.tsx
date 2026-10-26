import styles from "./Button.module.css";
import clsx from "clsx";

import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variants?: (
		| "primary"
		| "danger"
		| "transparent"
		| "button-md"
		| "button-sm"
	)[];
}

export const Button = ({
	variants = ["primary"],
	type = "button",
	className,
	...props
}: ButtonProps) => {
	return (
		<button
			type={type}
			className={clsx(
				styles["button"],
				variants.map((variant) => styles[variant]),
				className,
			)}
			{...props}
		></button>
	);
};
