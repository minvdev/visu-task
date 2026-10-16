import styles from "./Board.module.css";
import clsx from "clsx";

import { Card } from "@pages/DashboardPage/components/Card/Card";
import { ButtonBase } from "@atoms/ButtonBase/ButtonBase";

import { BoardSubschema } from "@pages/DashboardPage/types";

export interface BoardProps {
	board: BoardSubschema;
	className?: string | undefined;
}

export const Board = ({ board, className }: BoardProps) => {
	return (
		<Card>
			<ButtonBase
				className={clsx(styles["container"], className)}
			>
				{board.image_url && (
					<img
						src={board.image_url}
						className={styles["image"]}
					/>
				)}
				<span className={styles["name"]}>{board.name}</span>
			</ButtonBase>
		</Card>
	);
};
