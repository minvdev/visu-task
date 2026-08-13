import styles from "./DashboardPage.module.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { boardService } from "@services/board";
import { defaultTagColors } from "@constants/tagColors";
import { backgrounds } from "@constants/defaultBoardBackgrounds";

import { Heading } from "@atoms/HeadingV2/Heading";
import { BoardCard } from "@molecules/BoardCard/BoardCard";
import { Popover } from "@atoms/Popover/Popover";
import { CreateBoardForm } from "@organisms/CreateBoardForm/CreateBoardForm";

import type { components } from "@/types/open-api-schema";
type Board = components["schemas"]["Board"];

export const DashboardPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [boards, setBoards] = useState<Board[]>([]);
	const [isCreatePopoverOpen, setIsCreatePopoverOpen] =
		useState(false);

	const fetchBoards = async () => {
		try {
			const { data, error } =
				await boardService.getBoards();
			if (error) throw error;
			setBoards(data);
		} catch (error) {
			console.log("Error loading boards: ", error);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchBoards();
	}, []);

	const handleCreateBoard = async ({
		title,
		imageId,
	}: {
		title: string;
		imageId: number;
	}) => {
		try {
			const selectedBackground = backgrounds.find(
				(bg) => bg.id === imageId,
			);

			if (!selectedBackground) return;

			await boardService.createBoard({
				name: title,
				image_url: selectedBackground.image_url,
				default_tag_colors: defaultTagColors.map(
					(tag) => tag.backgroundColor,
				),
			});

			fetchBoards();
			setIsCreatePopoverOpen(false);
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) return <div>Cargando ...</div>;

	return (
		<div className={styles["container"]}>
			<Heading level={3} className={styles["title"]}>
				Tus espacios de trabajo
			</Heading>

			<div className={styles["main"]}>
				{boards.map((board) => (
					<Link
						replace
						to={{ pathname: `/boards/${board.id}` }}
						key={board.id}
					>
						<BoardCard
							src={board.image_url}
							name={board.name}
							className={styles["board"]}
						/>
					</Link>
				))}

				<div className={styles["popoverContainer"]}>
					<div
						className={styles["createBoard"]}
						onClick={() => {
							setIsCreatePopoverOpen(true);
						}}
					>
						<BoardCard
							name="Nuevo Tablero"
							className={styles["board"]}
						/>
					</div>

					{isCreatePopoverOpen && (
						<Popover
							onClose={() => {
								setIsCreatePopoverOpen(false);
							}}
						>
							<CreateBoardForm
								onSubmit={handleCreateBoard}
								onCancel={() => {
									setIsCreatePopoverOpen(false);
								}}
								backgrounds={backgrounds}
							/>
						</Popover>
					)}
				</div>
			</div>
		</div>
	);
};
