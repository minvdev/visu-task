import styles from "./Input.module.css";
import clsx from "clsx";

import { type ComponentPropsWithRef } from "react";

export interface InputProps extends ComponentPropsWithRef<"input"> {
	defaultStyles?: boolean;
}

export const Input = ({
	type = "text",
	defaultStyles = true,
	className,
	...props
}: InputProps) => {
	return (
		<input
			className={clsx(
				styles["input"],
				defaultStyles && styles["default"],
				className,
			)}
			type={type}
			{...props}
		/>
	);
};
