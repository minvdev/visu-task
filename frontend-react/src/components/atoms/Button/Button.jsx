import styles from "./Button.module.css";
import clsx from "clsx";

export const Button = ({
	variant = "primary",
	type = "button",
	onClick,
	disabled = false,
	className,
	children,
	...props
}) => {
	return (
		<button
			type={type}
			className={clsx(styles.button, className)}
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
};
