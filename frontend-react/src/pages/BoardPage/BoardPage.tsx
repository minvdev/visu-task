import styles from "./BoardPage.module.css";
import clsx from "clsx";

import { BoardProvider } from "@/context/BoardContext/BoardProvider";
import { useBoardPage } from "./useBoardPage";
import { useNavigate } from "react-router-dom";

import { Board } from "@pages/BoardPage/components/Board/Board";
import { Button } from "@atoms/Button/Button";

const LOADER_BOX_HEIGHTS = [400, 300, 46];

export const BoardPage = () => {
	const {
		isLoading,
		error,
		initialBoard,
		isCompactTags,
		handleTagClick,
	} = useBoardPage();
	const navigate = useNavigate();

	if (isLoading) {
		return (
			<div className={styles["main"]}>
				<div
					className={clsx(styles["card"], styles["inbox"])}
				></div>

				<div
					className={clsx(
						styles["card"],
						styles["loader-card"],
					)}
				>
					{LOADER_BOX_HEIGHTS.map((height, i) => (
						<div
							className={styles["loader-box"]}
							style={{ height: `${height}px` }}
							key={i}
						></div>
					))}
				</div>
			</div>
		);
	}

	if (error || !initialBoard) {
		return (
			<h1>
				{error}{" "}
				<Button onClick={() => navigate("/")}>
					Volver
				</Button>
			</h1>
		);
	}

	return (
		<div className={styles["main"]}>
			<div
				className={clsx(styles["card"], styles["inbox"])}
			></div>

			<BoardProvider initialBoard={initialBoard}>
				<Board
					className={styles["card"]}
					isCompactTags={isCompactTags}
					onTagClick={handleTagClick}
				/>
			</BoardProvider>
		</div>
	);
};
