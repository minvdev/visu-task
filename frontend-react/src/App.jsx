import { AuthProvider } from "./context/AuthContext/AuthProvider";
import BaseView from "./pages/BaseView/BaseView";
import { LoginPage } from "./pages/LoginPage/LoginPage";
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
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
