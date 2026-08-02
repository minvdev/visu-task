import styles from "./MonthNavigate.module.css";

import { type ReactNode } from "react";
import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";

export interface MonthNavigateProps {
	onNavigate: () => void;
	children: ReactNode;
}

export function MonthNavigate({
	onNavigate,
	...props
}: MonthNavigateProps) {
	return (
		<ButtonBase
			{...props}
			onClick={onNavigate}
			className={styles["chevron"]}
		></ButtonBase>
	);
}
