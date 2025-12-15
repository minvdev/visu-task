import styles from "./Button.module.css";

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
			className={`${styles.button} ${styles[variant]} ${
				className ? styles[className] : ""
			}`}
			onClick={onClick}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
};
