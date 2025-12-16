import styles from "./Label.module.css";
import clsx from "clsx";

export const Label = ({
	htmlFor,
	children,
	className,
	...props
}) => {
	return (
		<label
			htmlFor={htmlFor}
			className={clsx(styles.label, className)}
			{...props}
		>
			{children}
		</label>
	);
};
