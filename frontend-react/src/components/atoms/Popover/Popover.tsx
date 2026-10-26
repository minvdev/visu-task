import styles from "./Popover.module.css";
import clsx from "clsx";

import {
	type ComponentPropsWithRef,
	type RefObject,
	useRef,
} from "react";
import { usePopover } from "./usePopover";
import { useClickOutside } from "@hooks/useClickOutside";

export interface PopoverProps extends ComponentPropsWithRef<"div"> {
	onClose: () => void;
	rightClass?: string | undefined;
	bottomClass?: string | undefined;
	ignoreElements?:
		| RefObject<Element | null>
		| RefObject<Element | null>[];
	ref?: RefObject<HTMLDivElement | null>;
}

/**
 * Displays content in a floating popover.
 *
 * By default, the popover is positioned using `rightClass`. If there is not
 * enough horizontal space to keep that position within the viewport, the
 * positioning automatically falls back to `bottomClass`.
 *
 * Both `rightClass` and `bottomClass` have built-in default styles, so they
 * only need to be provided when custom positioning is required.
 */
export const Popover = ({
	onClose,
	ignoreElements = [],
	rightClass,
	bottomClass,
	ref,
	className,
	...props
}: PopoverProps) => {
	const popoverRef =
		ref ?? useRef<HTMLDivElement | null>(null);
	const { positionClass } = usePopover(
		popoverRef,
		rightClass ?? styles["right"]!,
		bottomClass ?? styles["bottom"]!,
	);

	const elements = Array.isArray(ignoreElements)
		? ignoreElements
		: [ignoreElements];

	useClickOutside([popoverRef, ...elements], onClose);

	return (
		<div
			className={clsx(
				styles["popover"],
				positionClass,
				className,
			)}
			ref={popoverRef}
			{...props}
		/>
	);
};
