import styles from "./FormField.module.css";
import { Label } from "../../atoms/Label/Label";

export const FormField = ({
	label,
	htmlFor,
	error,
	children,
	className,
}) => {
	return (
		<div className={className}>
			<Label htmlFor={htmlFor} className={styles.label}>
				{label}
			</Label>

			<div className={styles.control}>{children}</div>

			{error && (
				<span className={styles.error}>{error}</span>
			)}
		</div>
	);
};
