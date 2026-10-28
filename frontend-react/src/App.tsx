import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext/AuthProvider";

import { AuthLayout } from "@components/templates/AuthLayout/AuthLayout";
import { MainLayout } from "@components/templates/MainLayout/MainLayout";

import { LoginPage } from "@pages/LoginPage/LoginPage";
import { RegisterPage } from "@pages/RegisterPage/RegisterPage";
import { ProtectedRoute } from "@components/utility/ProtectedRoute";
import { DashboardPage } from "@pages/DashboardPage/DashboardPage";
import { BoardPage } from "@pages/BoardPage/BoardPage";
import { AppInitializer } from "@components/utility/AppInitializer";

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<AppInitializer>
					<Routes>
						{/* Public routes */}
						<Route element={<AuthLayout />}>
							<Route
								path="/login"
								element={<LoginPage />}
							/>
							<Route
								path="/register"
								element={<RegisterPage />}
							/>
						</Route>

						<Route
							index
							element={<Navigate to="/dashboard" replace />}
						/>

						{/* Protected routes */}
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

						<Route
							path="*"
							element={<Navigate to="/" replace />}
						/>
					</Routes>
				</AppInitializer>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
