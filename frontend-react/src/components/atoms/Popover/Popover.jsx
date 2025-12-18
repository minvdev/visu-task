import styles from "./Popover.module.css";
import clsx from "clsx";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useRef, useState, useLayoutEffect } from "react";

export const Popover = ({
	onClose,
	className,
	children,
}) => {
	const popoverRef = useRef(null);
	const [positionClass, setPositionClass] = useState(
		styles.right
	);

	useClickOutside(popoverRef, onClose);

	useLayoutEffect(() => {
		if (!popoverRef.current) return;

		const rect = popoverRef.current.getBoundingClientRect();
		const viewportWidth = window.innerWidth;

		const setClass = () => {
			if (rect.right > viewportWidth) {
				setPositionClass(styles.bottom);
			}
		};
		setClass();
	}, []);

	return (
		<div
			className={clsx(
				styles.popover,
				positionClass,
				className
			)}
			ref={popoverRef}
		>
			{children}
		</div>
	);
};
