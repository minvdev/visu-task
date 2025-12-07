import { AuthProvider } from "./context/AuthContext/AuthProvider";
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
					<Route path="/" element={<BaseView></BaseView>} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

export default App;
