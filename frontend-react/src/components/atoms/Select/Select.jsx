import styles from "./Select.module.css";

export const Select = ({
	options = [],
	value = "",
	onChange,
	name,
	placeholder = "Selecciona una opción...",
	disabled = false,
	...props
}) => {
	return (
		<div className={styles.wrapper}>
			<select
				className={styles.select}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
				{...props}
			>
				<option value="" disabled hidden>
					{placeholder}
				</option>

				{options.map((option) => (
					<option value={option.value} key={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<span className={styles.arrow} />
		</div>
	);
};
