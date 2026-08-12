import {
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@services/auth";
import { userService } from "@services/user";
import { parseAuthError } from "@/utils/parseAuthError";

import type {
	User,
	AuthContextType,
	LoginResult,
	RegisterResult,
} from "@/types/auth";

const AuthContext = createContext<
	AuthContextType | undefined
>(undefined);

export function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	const login = async (
		username: string,
		password: string,
	): Promise<LoginResult> => {
		const { data: loginData, error: loginError } =
			await authService.login({
				username,
				password,
			});

		if (loginError) {
			return {
				success: false,
				error: parseAuthError(loginError),
			};
		}

		localStorage.setItem("token", loginData.access_token);
		const { data: userData, error: userError } =
			await userService.getMe();

		if (userError) {
			localStorage.removeItem("token");
			return {
				success: false,
				error: parseAuthError(userError),
			};
		}

		setUser(userData);
		return { success: true };
	};

	const logout = async () => {
		localStorage.removeItem("token");
		setUser(null);
	};

	const register = async (
		username: string,
		email: string,
		password: string,
	): Promise<RegisterResult> => {
		const { data: registerData, error: registerError } =
			await authService.register({
				username,
				email,
				password,
			});

		if (registerError) {
			return {
				success: false,
				error: parseAuthError(registerError),
			};
		}

		const { data: loginData, error: loginError } =
			await authService.login({
				username,
				password,
			});

		if (loginError) {
			return {
				success: false,
				error: parseAuthError(loginError),
			};
		}

		localStorage.setItem("token", loginData.access_token);
		setUser(registerData);
		return { success: true };
	};

	const checkAuth = async () => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const { data, error } = await userService.getMe();

				if (error) {
					localStorage.removeItem("token");
					throw new Error("Session expired");
				}

				setUser(data);
			} catch (error) {
				console.error(error);
			}
		}
		setIsLoading(false);
	};

	const handleExpired = () => {
		logout();
		navigate("/login");
	};

	useEffect(() => {
		checkAuth();
		window.addEventListener("auth:expired", handleExpired);
		// Cleanup
		return () =>
			window.removeEventListener(
				"auth:expired",
				handleExpired,
			);
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, login, logout, register, isLoading }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error(
			"useAuth must be used inside of an AuthProvider",
		);
	return context;
}
