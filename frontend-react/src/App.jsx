import { AuthProvider } from "./context/AuthContext";
import LoginView from "./pages/LoginView";
import BaseView from "./pages/BaseView/BaseView";
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
					<Route
						path="/"
						element={
							<BaseView>
								<LoginView />
							</BaseView>
						}
					/>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
