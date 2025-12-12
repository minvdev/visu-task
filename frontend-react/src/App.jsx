import { AuthProvider } from "./context/AuthContext/AuthProvider";
import BaseView from "./pages/BaseView/BaseView";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import {
	BrowserRouter,
	Routes,
	Route,
} from "react-router-dom";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<LoginPage />} />

					<Route
						path="/register"
						element={<RegisterPage />}
					/>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
