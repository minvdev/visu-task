import styles from "./AuthLayout.module.css";
import clsx from "clsx";

import { type ComponentPropsWithRef } from "react";
import { Outlet } from "react-router-dom";

export interface AuthLayoutProps extends ComponentPropsWithRef<"div"> {}

export const AuthLayout = ({
	className,
	...props
}: AuthLayoutProps) => {
	return (
		<div
			className={clsx(styles["container"], className)}
			{...props}
		>
			<div className={styles["outlet"]}>
				<Outlet />
			</div>
		</div>
	);
};
