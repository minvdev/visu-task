import { ComponentPropsWithRef } from "react";
import styles from "./Input.module.css";
import clsx from "clsx";

export interface InputProps extends ComponentPropsWithRef<"input"> {
	variants?: ("input-default" | "input-md" | "input-sm")[];
}

export const Input = ({
	variants = ["input-default"],
	type = "text",
	className,
	...props
}: InputProps) => {
	return (
		<input
			className={clsx(
				styles["input"],
				variants.map((variant) => styles[variant]),
				className,
			)}
			type={type}
			{...props}
		/>
	);
};
