import styles from "./CreateBoardForm.module.css";
import clsx from "clsx";

import { type ComponentPropsWithRef } from "react";

export interface CreateBoardFormProps extends ComponentPropsWithRef<"form"> {}

export const CreateBoardForm = ({
	className,
	...props
}: CreateBoardFormProps) => {
	return (
		<form
			className={clsx(styles["container"], className)}
			{...props}
		></form>
	);
};
