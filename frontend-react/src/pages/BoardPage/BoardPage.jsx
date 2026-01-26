import styles from "./BoardPage.module.css";
import clsx from "clsx";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../services/api";

import { Heading } from "../../components/atoms/Heading/Heading";
import { CreateTaskForm } from "../../components/organisms/CreateTaskForm/CreateTaskForm";
import { ButtonBase } from "../../components/atoms/ButtonBase/ButtonBase";
import { Task } from "../../components/atoms/Task/Task";
import { TaskList } from "../../components/molecules/TaskList/TaskList";
import { EditableText } from "../../components/molecules/EditableText/EditableText";
import { Column } from "../../components/organisms/Column/Column";
import { CreateColumnForm } from "../../components/organisms/CreateColumnForm/CreateColumnForm";
import { Image } from "../../components/atoms/Image/Image";

import { boardTransformers } from "../../constants/boardTransformers";
import { InboxIcon } from "../../assets/icons/InboxIcon/InboxIcon";
import { PlusIcon } from "../../assets/icons/PlusIcon/PlusIcon";

export const BoardPage = () => {
	const { boardId: boardIdParam } = useParams();
	const boardId = parseInt(boardIdParam);
	const { user } = useAuth();
	const [inbox, setInbox] = useState(null);
	const [board, setBoard] = useState(null);
	const [isAddColumnFormOpen, setIsAddColumnFormOpen] =
		useState(false);
	const [
		isAddInboxTaskFormOpen,
		setIsAddInboxTaskFormOpen,
	] = useState(false);

	const handleBoardUpdate = async (body) => {
		try {
			const updatedBoard = await apiFetch(
				`/boards/${boardId}`,
				{ method: "PATCH", body },
			);
			setBoard(
				boardTransformers.updateBoard(board, updatedBoard),
			);
		} catch (error) {
			console.log("Error saving board:", error);
			throw error;
		}
	};

	// Column Handlers
	const handleColumnCreate = async (
		board,
		name,
		inInbox = false,
	) => {
		try {
			const newColumn = await apiFetch(
				`/boards/${board.id}/lists`,
				{ method: "POST", body: { name } },
			);
			const newBoard = boardTransformers.addColumn(
				board,
				newColumn,
			);
			inInbox ? setInbox(newBoard) : setBoard(newBoard);
		} catch (error) {
			console.log("Error adding column:", error);
			throw error;
		}
	};

	const handleColumnDelete = async (
		board,
		columnId,
		inInbox = false,
	) => {
		try {
			await apiFetch(
				`/boards/${board.id}/lists/${columnId}`,
				{
					method: "DELETE",
				},
			);
			const newBoard = boardTransformers.deleteColumn(
				board,
				columnId,
			);
			inInbox ? setInbox(newBoard) : setBoard(newBoard);
		} catch (error) {
			console.log("Error deleting column:", error);
			throw error;
		}
	};

	const handleColumnUpdate = async (
		board,
		columnId,
		body,
		inInbox = false,
	) => {
		try {
			const updatedColumn = await apiFetch(
				`/boards/${board.id}/lists/${columnId}`,
				{ method: "PATCH", body },
			);
			const newBoard = boardTransformers.updateColumn(
				board,
				columnId,
				updatedColumn,
			);
			inInbox ? setInbox(newBoard) : setBoard(newBoard);
		} catch (error) {
			console.log("Error saving column:", error);
			throw error;
		}
	};

	// Task Handlers
	const handleTaskCreate = async (
		board,
		columnId,
		body,
		inInbox = false,
	) => {
		try {
			const newTask = await apiFetch(
				`/boards/${board.id}/lists/${columnId}/cards`,
				{ method: "POST", body },
			);
			const newBoard = boardTransformers.addTask(
				board,
				columnId,
				newTask,
			);
			inInbox ? setInbox(newBoard) : setBoard(newBoard);
		} catch (error) {
			console.log("Error adding task:", error);
			throw error;
		}
	};

	const handleTaskDelete = async (
		board,
		columnId,
		taskId,
		inInbox = false,
	) => {
		try {
			await apiFetch(
				`/boards/${board.id}/lists/${columnId}/cards/${taskId}`,
				{ method: "DELETE" },
			);

			const newBoard = boardTransformers.deleteTask(
				board,
				columnId,
				taskId,
			);

			inInbox ? setInbox(newBoard) : setBoard(newBoard);
		} catch (error) {
			console.log("Error deleting task:", error);
			throw error;
		}
	};

	const handleTaskEdit = async () => {};

	const handleTaskUpdate = async (
		board,
		columnId,
		taskId,
		body,
		inInbox = false,
	) => {
		try {
			const updatedTask = await apiFetch(
				`/boards/${board.id}/lists/${columnId}/cards/${taskId}`,
				{ method: "PATCH", body },
			);
			const newBoard = boardTransformers.updateTask(
				board,
				columnId,
				taskId,
				updatedTask,
			);
			inInbox ? setInbox(newBoard) : setBoard(newBoard);
		} catch (error) {
			console.log("Error saving task:", error);
			throw error;
		}
	};

	useEffect(() => {
		const loadInbox = async () => {
			try {
				const inboxData = await apiFetch(`/inbox`);
				setInbox(inboxData);
			} catch (error) {
				console.log("Error loading inbox: ", error);
				throw error;
			}
		};
		const loadBoard = async () => {
			try {
				const boards = await apiFetch(`/boards`);
				const boardData = boards.filter(
					(b) => b.id === boardId,
				)[0];

				const boardLists = await apiFetch(
					`/boards/${boardId}/lists`,
				);

				setBoard(
					boardTransformers.setupBoard(
						boardData,
						boardLists,
					),
				);
			} catch (error) {
				console.log("Error loading board: ", error);
				throw error;
			}
		};

		loadBoard();
		loadInbox();
	}, [user, boardId]);

	if (!board || !inbox) return <div>Cargando...</div>;

	return (
		<div className={styles.mainContainer}>
			<div className={styles.inboxBoardContainer}>
				<div className={styles.boardTab}>
					<div
						className={clsx(
							styles.wrapper,
							styles.inboxNameWrapper,
						)}
					>
						<InboxIcon className={styles.inboxIcon} />
						<Heading
							level={3}
							className={styles.boardTabHeading}
						>
							{inbox.name}
						</Heading>
					</div>
				</div>

				<div
					className={clsx(
						styles.inboxBoardContent,
						styles.boardContent,
					)}
				>
					{isAddInboxTaskFormOpen ? (
						<CreateTaskForm
							onSubmit={(body) =>
								handleTaskCreate(
									inbox,
									inbox.lists[0].id,
									body,
									true,
								)
							}
							onCancel={() =>
								setIsAddInboxTaskFormOpen(false)
							}
						/>
					) : (
						<ButtonBase
							onClick={() =>
								setIsAddInboxTaskFormOpen(true)
							}
						>
							<Task
								isAddTaskVariant={true}
								className={styles.addTask}
							>
								Añade una tarjeta
							</Task>
						</ButtonBase>
					)}

					{inbox?.lists && inbox.lists[0]?.cards && (
						<TaskList
							tasks={inbox?.lists[0]?.cards}
							onTaskUpdate={(taskId, body) =>
								handleTaskUpdate(
									inbox,
									inbox.lists[0].id,
									taskId,
									body,
									true,
								)
							}
						/>
					)}
				</div>
			</div>

			<div className={styles.mainBoardContainer}>
				<div className={styles.boardTab}>
					<EditableText
						inputName="boardInput"
						onSave={(name) => handleBoardUpdate({ name })}
					>
						<Heading
							level={3}
							className={clsx(
								styles.boardTabHeading,
								styles.hoverOverlay,
							)}
						>
							{board.name}
						</Heading>
					</EditableText>
				</div>

				<div
					className={clsx(
						styles.boardContent,
						styles.mainBoardContent,
					)}
				>
					{board.lists
						.sort((a, b) => a.position - b.position)
						.map((column) => (
							<Column
								className={styles.column}
								id={column.id}
								key={column.id}
								columnTasks={column.cards}
								onColumnUpdate={(id, body) =>
									handleColumnUpdate(board, id, body)
								}
								onColumnDelete={(id) =>
									handleColumnDelete(board, id)
								}
								onTaskUpdate={(columnId, taskId, body) =>
									handleTaskUpdate(
										board,
										columnId,
										taskId,
										body,
									)
								}
								onTaskDelete={(columnId, taskId) =>
									handleTaskDelete(board, columnId, taskId)
								}
								onTaskEdit={() => handleTaskEdit()}
								onTaskCreate={(id, body) =>
									handleTaskCreate(board, id, body)
								}
							>
								{column.name}
							</Column>
						))}

					{isAddColumnFormOpen ? (
						<CreateColumnForm
							className={styles.column}
							onSubmit={(name) =>
								handleColumnCreate(board, name)
							}
							onCancel={() => setIsAddColumnFormOpen(false)}
						/>
					) : (
						<ButtonBase
							onClick={() => setIsAddColumnFormOpen(true)}
							className={styles.addColumnBtn}
						>
							<Task
								className={clsx(
									styles.column,
									styles.addColumn,
								)}
								isAddTaskVariant={true}
							>
								<div className={styles.wrapper}>
									<PlusIcon />
									<span>Añade otra lista</span>
								</div>
							</Task>
						</ButtonBase>
					)}
				</div>

				<Image
					className={styles.backgroundImage}
					src={board.image_url}
				/>
			</div>
		</div>
	);
};
