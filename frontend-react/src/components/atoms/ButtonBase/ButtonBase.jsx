import styles from "./ButtonBase.module.css";
import clsx from "clsx";

export const ButtonBase = ({
	type = "button",
	onClick,
	disabled = false,
	className,
	children,
	tabIndex,
	...props
}) => {
	return (
		<button
			type={type}
			className={clsx(styles.buttonBase, className)}
			onClick={onClick}
			disabled={disabled}
			tabIndex={disabled ? -1 : tabIndex}
			{...props}
		>
			{children}
		</button>
	);
};
