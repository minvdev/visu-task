import { useState, useEffect } from "react";
import { apiFetch } from "../../services/api";
import { AuthContext } from "./context";

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] =
		useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("token");

			if (token) {
				try {
					const userData = await apiFetch("/users/me");
					setUser(userData);
					setIsAuthenticated(true);
				} catch (error) {
					console.log(`Error checking auth: ${error}`);
					localStorage.removeItem("token");
				}
			}
			setLoading(false);
		};
		checkAuth();
	}, []);

	const login = (token, userData) => {
		localStorage.setItem("token", token);
		setUser(userData);
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem("token");
		setUser(null);
		setIsAuthenticated(false);
	};

	const value = {
		user,
		isAuthenticated,
		loading,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
