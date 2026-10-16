import styles from "./Error.module.css";

import { Link } from "react-router-dom";

export interface ErrorProps {}

export const Error = ({}: ErrorProps) => {
	return (
		<p>
			Ha ocurrido un error al cargar los tableros.{" "}
			<Link to="/" className={styles["link"]}>
				Volver
			</Link>
		</p>
	);
};
