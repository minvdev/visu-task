import styles from "./DashboardPage.module.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { boardService } from "@services/board";
import type { BoardSubschema } from "./types";

import { Board } from "./components/Board/Board";
import { AddBoard } from "./components/AddBoard/AddBoard";
import { Error } from "./components/Error/Error";
import { Loading } from "./components/Loading/Loading";
import { Heading } from "@atoms/HeadingV2/Heading";

export const DashboardPage = () => {
	const [sortedBoards, setBoards] = useState<
		BoardSubschema[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		async function fetchBoards() {
			try {
				setIsLoading(true);

				const { data, error } =
					await boardService.getBoards();

				if (error) {
					setError(true);
					return;
				}

				setBoards(
					data.toSorted((a, b) =>
						a.name.localeCompare(b.name),
					),
				);
			} catch (error) {
				setError(true);
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchBoards();
	}, []);

	return (
		<div className={styles["container"]}>
			<Heading level={3} className={styles["title"]}>
				Tus espacios de trabajo
			</Heading>

			<div className={styles["main"]}>
				{isLoading ? (
					<Loading />
				) : error ? (
					<Error />
				) : (
					<>
						{sortedBoards.map((board) => (
							<Link
								to={`/boards/${board.id}`}
								key={board.id}
							>
								<Board board={board} />
							</Link>
						))}

						<AddBoard />
					</>
				)}
			</div>
		</div>
	);
};
