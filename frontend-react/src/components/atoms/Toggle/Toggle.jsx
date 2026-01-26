import styles from "./Toggle.module.css";
import clsx from "clsx";

export const Toggle = ({
	type = "button",
	onToggleOn,
	onToggleOff,
	isToggled,
	disabled = false,
	className,
	children,
	tabIndex,
	...props
}) => {
	const handleClick = (newToggledState) => {
		newToggledState ? onToggleOn() : onToggleOff();
	};

	return (
		<button
			type={type}
			className={clsx(
				styles.toggleBtn,
				isToggled && styles.toggled,
				className,
			)}
			onClick={() => handleClick(!isToggled)}
			disabled={disabled}
			tabIndex={disabled ? -1 : tabIndex}
			{...props}
		>
			{children}
		</button>
	);
};
