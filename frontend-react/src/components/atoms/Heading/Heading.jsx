import styles from "./Heading.module.css";

export const Heading = ({
	level = 1,
	children,
	variant = "primary",
	className,
	...props
}) => {
	const safeLevel = Math.min(Math.max(level, 1), 6);
	const Tag = `h${safeLevel}`;

	return (
		<Tag
			className={`${styles.heading} ${
				styles[`h${safeLevel}`]
			} ${styles[variant]} ${className || ""}`}
			{...props}
		>
			{children}
		</Tag>
	);
};
