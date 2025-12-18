import styles from "./DashboardPage.module.css";
import { Heading } from "../../components/atoms/Heading/Heading";
import { Board } from "../../components/molecules/Board/Board";
import { Popover } from "../../components/atoms/Popover/Popover";
import { CreateBoardForm } from "../../components/organisms/CreateBoardForm/CreateBoardForm";
import { Link } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { useEffect, useState } from "react";
import { slugify } from "../../utils/slugify";
import { backgrounds } from "../../constants/defaultBoardBackgrounds";

export const DashboardPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [boards, setBoards] = useState([]);
	const [isCreatePopoverOpen, setIsCreatePopoverOpen] =
		useState(false);

	const fetchBoards = async () => {
		try {
			const boardsData = await apiFetch("/boards");
			setBoards(boardsData);
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

	const hanldeCreateBoard = async ({ title, imageId }) => {
		try {
			const selectedBackground = backgrounds.find(
				(bg) => bg.id === imageId
			);

			await apiFetch("/boards", {
				method: "POST",
				body: {
					name: title,
					image_url: selectedBackground.image_url,
				},
			});

			fetchBoards();
			setIsCreatePopoverOpen(false);
		} catch (error) {
			console.error(error);
		}
	};

	if (isLoading) return <div>Cargando ...</div>;

	return (
		<div className={styles.container}>
			<Heading level={1}>Tus espacios de trabajo</Heading>

			<div className={styles.cardContainer}>
				{boards.map((board) => (
					<Link
						replace
						to={{
							pathname: `/boards/${slugify(board.name)}`,
							search: `?id=${board.id}`,
						}}
						key={board.id}
					>
						<Board
							src={board.image_url}
							name={board.name}
							className={styles.board}
						/>
					</Link>
				))}

				<div className={styles.popoverContainer}>
					<div
						className={styles.createBoard}
						onClick={() => {
							setIsCreatePopoverOpen(true);
						}}
					>
						<Board
							name="Nuevo Tablero"
							className={styles.board}
						/>
					</div>

					{isCreatePopoverOpen && (
						<Popover
							onClose={() => {
								setIsCreatePopoverOpen(false);
							}}
						>
							<CreateBoardForm
								onSubmit={hanldeCreateBoard}
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
