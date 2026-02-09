import styles from "./Modal.module.css";
import clsx from "clsx";

export const Modal = ({
	ref,
	onClose,
	className,
	children,
}) => {
	return (
		<dialog
			ref={ref}
			onClose={onClose}
			className={clsx(styles.dialog, className)}
		>
			{children}
		</dialog>
	);
};
