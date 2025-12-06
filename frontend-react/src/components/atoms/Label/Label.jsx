import styles from "./Label.module.css";

export const Label = ({
	htmlFor,
	children,
	className,
	...props
}) => {
	return (
		<label
			htmlFor={htmlFor}
			className={`${styles.label} ${className || ""}`}
			{...props}
		>
			{children}
		</label>
	);
};
