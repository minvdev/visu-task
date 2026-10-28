import React, { useEffect, RefObject } from "react";
import type { ModalProps } from "./Modal";

export const useModal = (
	dialogRef: RefObject<HTMLDialogElement | null>,
	onClose: ModalProps["onClose"],
) => {
	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (!dialog.open) dialog.showModal();
	}, []);

	const handleBackdropClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		const dialog = dialogRef.current;
		if (!dialog) return;

		const dialogDimensions = dialog.getBoundingClientRect();
		const { clientX, clientY } = e;

		if (
			clientX < dialogDimensions.left ||
			clientX > dialogDimensions.right ||
			clientY < dialogDimensions.top ||
			clientY > dialogDimensions.bottom
		) {
			onClose();
		}
	};

	return {
		handleBackdropClick,
	};
};
