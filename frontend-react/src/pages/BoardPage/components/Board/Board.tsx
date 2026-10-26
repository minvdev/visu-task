import styles from "./Board.module.css";
import clsx from "clsx";

import { useState, type MouseEvent } from "react";
import { useBoard } from "./useBoard";

import { Menu } from "./components/Menu/Menu";
import { AddColumn } from "./components/AddColumn/AddColumn";
import { EditableText } from "@components/molecules/EditableText/EditableText";
import { ColumnProvider } from "@/context/ColumnContext/ColumnProvider";
import { Column } from "@pages/BoardPage/components/Column/Column";

export interface BoardProps {
	className?: string | undefined;
	isCompactTags: boolean;
	onTagClick: () => void;
}

export const Board = ({
	isCompactTags,
	onTagClick,
	className,
}: BoardProps) => {
	const { board, name, onBoardChange, onBoardSave } =
		useBoard();

	const [isAddingColumn, setIsAddingColumn] =
		useState(false);

	const handleOpenAddColumn = (e: MouseEvent) => {
		e.currentTarget.scrollIntoView({ inline: "center" });
	};

	return (
		<div className={clsx(styles["container"], className)}>
			<header className={styles["header"]}>
				<div className={styles["headingWrapper"]}>
					<EditableText
						as="h1"
						value={name}
						onChange={onBoardChange}
						onBlur={(name) => onBoardSave(board.name, name)}
						onFocus={(e) => e.target.select()}
						name="board-name"
						className={styles["heading"]}
					/>
				</div>

				<Menu />
			</header>

			<section className={styles["content"]}>
				{board.lists
					.sort((a, b) => a.position - b.position)
					.map((column) => (
						<ColumnProvider
							initialValue={column}
							key={column.id}
						>
							<Column
								className={styles["column"]}
								isCompactTags={isCompactTags}
								onTagClick={onTagClick}
							/>
						</ColumnProvider>
					))}

				<div className={styles["column"]}>
					<AddColumn
						isAddingColumn={isAddingColumn}
						setIsAddingColumn={setIsAddingColumn}
						onOpen={handleOpenAddColumn}
						className={styles["addColumn"]}
					/>
				</div>
			</section>

			<img
				className={styles["backgroundImage"]}
				src={board.image_url ?? undefined}
				onError={(e) =>
					(e.currentTarget.style.display = "none")
				}
			/>
		</div>
	);
};
