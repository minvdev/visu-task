import styles from "./MainLayout.module.css";
import { Navbar } from "../../organisms/Navbar/Navbar";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
	return (
		<div className={styles.layout}>
			<header className={styles.header}>
				<Navbar />
			</header>

			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	);
};
