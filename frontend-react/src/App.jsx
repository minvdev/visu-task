import { AuthProvider } from "./context/AuthContext/AuthProvider";
import { MainLayout } from "./components/templates/MainLayout/MainLayout";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/utility/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage/DashboardPage";
import { BoardPage } from "./pages/BoardPage/BoardPage";
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

					<Route
						path="/"
						element={<Navigate to="/dashboard" />}
					/>

					<Route
						element={
							<ProtectedRoute>
								<MainLayout />
							</ProtectedRoute>
						}
					>
						<Route
							path="/dashboard"
							element={<DashboardPage />}
						/>

						<Route
							path="/boards/:boardId"
							element={<BoardPage />}
						/>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
