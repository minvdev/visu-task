import styles from "./Modal.module.css";
import clsx from "clsx";

import {
	ComponentPropsWithRef,
	RefObject,
	useRef,
} from "react";
import { createPortal } from "react-dom";
import { useModal } from "./useModal";

export interface ModalProps extends Omit<
	ComponentPropsWithRef<"dialog">,
	"onClick"
> {
	onClose: () => void;
	ref?: RefObject<HTMLDialogElement | null>;
}

export const Modal = ({
	onClose,
	ref,
	className,
	...props
}: ModalProps) => {
	const modalRoot = document.getElementById("modal-root");
	const dialogRef =
		ref ?? useRef<HTMLDialogElement | null>(null);
	const { handleBackdropClick } = useModal(
		dialogRef,
		onClose,
	);

	if (!modalRoot) return null;

	return createPortal(
		<dialog
			className={clsx(styles["container"], className)}
			onClick={handleBackdropClick}
			onClose={onClose}
			ref={dialogRef}
			{...props}
		/>,
		modalRoot,
	);
};
