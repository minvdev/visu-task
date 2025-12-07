import styles from "./Dashboard.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { useLogout } from "../../hooks/useLogout";
import LoadingSVG from "../../assets/icons/arrow-clockwise.svg";

function Dashboard() {
	const [boards, setBoards] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const logout = useLogout();

	useEffect(() => {
		const fetchBoards = async () => {
			try {
				const data = await apiFetch("/boards");
				setBoards(data);
			} catch (error) {
				console.log("Error cargando tableros", error);
				setError("Error: " + error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchBoards();
	}, []);

	if (loading) {
		return (
			<div className="loading">
				<span>Cargando tus proyectos</span>
				<img src={LoadingSVG} />
			</div>
		);
	}
	return (
		<div className={styles["dashboard-container"]}>
			<header className={styles["dashboard-header"]}>
				<h2>Mis Tableros</h2>
				<button onClick={logout}>Cerrar Sesión</button>
			</header>

			{error && <div className="error-msg">{error}</div>}

			<main className={styles["boards-grid"]}>
				{boards.length === 0 ? (
					<p>No tienes tableros, crea uno!</p>
				) : (
					boards.map((board) => (
						<Link to={`/boards/${board.id}`} key={board.id}>
							<div
								className={styles["board-card"]}
								key={board.id}
							>
								<h2>{board.name}</h2>
								{board.description && (
									<p>{board.description}</p>
								)}
							</div>
						</Link>
					))
				)}
			</main>
		</div>
	);
}

export default Dashboard;
