import styles from "./AddBoard.module.css";
import clsx from "clsx";

import { useRef, useState } from "react";

import { Card } from "@pages/DashboardPage/components/Card/Card";
import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";
import { Popover } from "@atoms/Popover/Popover";
import { MenuHeader } from "@components/molecules/MenuHeader/MenuHeader";

export interface AddBoardProps {
	disabled?: boolean;
	className?: string | undefined;
}

export const AddBoard = ({
	disabled,
	className,
}: AddBoardProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	return (
		<Card className={styles["card"]}>
			<ButtonBase
				onClick={() => setIsOpen((prev) => !prev)}
				ref={buttonRef}
				disabled={disabled}
				className={clsx(styles["container"], className)}
			>
				<span>Crear un tablero nuevo</span>
			</ButtonBase>

			{isOpen && (
				<Popover
					onClose={() => setIsOpen(false)}
					ignoreElements={buttonRef}
					rightClass={styles["popPosition"]}
					bottomClass={styles["popPositionFallback"]}
				>
					<MenuHeader
						title="Crear tablero"
						onClose={() => setIsOpen(false)}
					/>
				</Popover>
			)}
		</Card>
	);
};
