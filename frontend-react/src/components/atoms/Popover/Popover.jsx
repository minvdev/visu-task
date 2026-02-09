import styles from "./Popover.module.css";
import clsx from "clsx";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useRef, useState, useLayoutEffect } from "react";

export const Popover = ({
	onClose,
	className,
	children,
	rightClass = null,
	bottomClass = null,
	ignoreElements = [],
}) => {
	const popoverRef = useRef(null);
	const [positionClass, setPositionClass] = useState(
		rightClass || styles.right,
	);

	if (!Array.isArray(ignoreElements))
		ignoreElements = [ignoreElements];

	useClickOutside([popoverRef, ...ignoreElements], onClose);

	useLayoutEffect(() => {
		if (!popoverRef.current) return;

		const rect = popoverRef.current.getBoundingClientRect();
		const viewportWidth = window.innerWidth;

		const setClass = () => {
			// 24px accounts for the main container's padding to prevent overflow
			if (rect.right + 24 > viewportWidth) {
				setPositionClass(bottomClass || styles.bottom);
			}
		};
		setClass();
	}, [bottomClass]);

	return (
		<div
			className={clsx(
				styles.popover,
				positionClass,
				className,
			)}
			ref={popoverRef}
		>
			{children}
		</div>
	);
};
