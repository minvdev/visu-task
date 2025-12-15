import styles from "./Input.module.css";

export const Input = ({
	type = "text",
	value = "",
	onChange,
	placeholder,
	className = "input-default",
	...props
}) => {
	return (
		<input
			className={`${styles.input} ${
				className ? styles[className] : ""
			}`}
			type={type}
			onChange={onChange}
			placeholder={placeholder}
			value={value}
			{...props}
		/>
	);
};
