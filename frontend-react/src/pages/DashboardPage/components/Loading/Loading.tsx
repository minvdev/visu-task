import styles from "./Loading.module.css";

import { Card } from "@pages/DashboardPage/components/Card/Card";

export interface LoadingProps {}

export const Loading = ({}: LoadingProps) => {
	return (
		<>
			{Array.from({ length: 4 }).map((_, i) => (
				<Card
					key={i}
					aria-label="Cargando"
					className={styles["loading"]}
				/>
			))}
		</>
	);
};
