import styles from "./BoardPage.module.css";
import {
	useParams,
	useSearchParams,
} from "react-router-dom";
import { Heading } from "../../components/atoms/Heading/Heading";
import { Link } from "react-router-dom";

export const BoardPage = () => {
	const { boardSlug } = useParams();
	const [searchParams, _] = useSearchParams();
	const id = searchParams.get("id");

	return (
		<div className={styles.container}>
			<Heading level={1}>
				Board Page{" "}
				<Link to="/dashboard">
					<button type="button">Back to Dashboard</button>
				</Link>
			</Heading>

			<Heading level={3}>BoardSlug: {boardSlug}</Heading>
			<Heading level={3}>Id: {id}</Heading>
		</div>
	);
};
