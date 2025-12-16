import styles from "./Button.module.css";
import clsx from "clsx";

export const Button = ({
	variants = ["primary"],
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
			className={clsx(
				styles.button,
				variants.map((variant) => styles[variant]),
				className
			)}
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
};
