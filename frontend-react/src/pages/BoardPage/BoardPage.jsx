import styles from "./BoardPage.module.css";
import { useParams } from "react-router-dom";
import { Heading } from "../../components/atoms/Heading/Heading";

export const BoardPage = () => {
	const { boardId: boardIdParam } = useParams();
	const boardId = parseInt(boardIdParam);

	return (
		<div className={styles.mainContainer}>
			
		</div>
	);
};
