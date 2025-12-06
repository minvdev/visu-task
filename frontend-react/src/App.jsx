import styles from "./App.module.css";
import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<div className={styles["app-container"]}>
				<h1>VisuTask</h1>

				<Routes>
					<Route path="/" />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
