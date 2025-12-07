import styles from "./Input.module.css";

export const Input = ({
	type = "text",
	value = "",
	onChange,
	placeholder,
	className,
	...props
}) => {
	return (
		<input
			className={`${styles.input} ${className || ""}`}
			type={type}
			onChange={onChange}
			placeholder={placeholder}
			value={value}
			{...props}
		/>
	);
};
