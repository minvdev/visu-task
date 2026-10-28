import styles from "./AddColumn.module.css";

import { useRef, type MouseEvent } from "react";
import { useClickOutside } from "@hooks/useClickOutside";
import { useKeyPress } from "@hooks/useKeyPress";

import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { CreateColumnForm } from "@pages/BoardPage/components/CreateColumnForm/CreateColumnForm";
import { LucidePlus } from "lucide-react";

export interface AddColumnProps {
	isAddingColumn: boolean;
	setIsAddingColumn: (b: boolean) => void;
	onOpen?: (e: MouseEvent<HTMLButtonElement>) => void;
	className?: string | undefined;
}

export const AddColumn = ({
	isAddingColumn,
	setIsAddingColumn,
	onOpen,
	className,
}: AddColumnProps) => {
	const formRef = useRef<HTMLFormElement | null>(null);
	useClickOutside(formRef, () => setIsAddingColumn(false));
	useKeyPress("Escape", () => {
		if (!isAddingColumn) return;
		setIsAddingColumn(false);
	});

	function handleClick(e: MouseEvent<HTMLButtonElement>) {
		setIsAddingColumn(true);
		onOpen?.(e);
	}

	const handleClose = () => setIsAddingColumn(false);

	return isAddingColumn ? (
		<CreateColumnForm
			className={className}
			onClose={handleClose}
			ref={formRef}
		/>
	) : (
		<ButtonBase className={className} onClick={handleClick}>
			<div className={styles["card"]}>
				<LucidePlus size={20} />
				Añade otra lista
			</div>
		</ButtonBase>
	);
};
