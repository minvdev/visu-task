import { AuthProvider } from "./context/AuthContext/AuthProvider";
import { MainLayout } from "./components/templates/MainLayout/MainLayout";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/utility/ProtectedRoute";
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
						element={
							<ProtectedRoute>
								<MainLayout />
							</ProtectedRoute>
						}
					>
						<Route
							path="/dashboard"
							element={<h1>Dashboard</h1>}
						/>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
