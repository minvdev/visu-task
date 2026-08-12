import {
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@services/auth";
import { userService } from "@services/user";
import { AuthError } from "./AuthErrors";

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
		const { data, error } = await authService.login({
			username,
			password,
		});

		if (error || !data) {
			throw new AuthError(
				typeof error?.detail === "string"
					? error.detail // HTTP error API message
					: "Failed to login. Try again",
			);
		}

		localStorage.setItem("token", data.access_token);

		const { data: userData } = await userService.getMe();

		if (!userData) {
			localStorage.removeItem("token");
			throw new AuthError("Failed to login. Try again", {
				cause: "Invalid token",
			});
		}

		setUser(userData);
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

		if (registerError || !registerData) {
			throw new AuthError(
				typeof registerError?.detail === "string"
					? registerError.detail // HTTP error API message
					: "Failed to register. Try again",
			);
		}

		const { data: loginData, error: loginError } =
			await authService.login({
				username,
				password,
			});

		if (loginError || !loginData) {
			throw new AuthError(
				typeof loginError?.detail === "string"
					? loginError.detail // HTTP error API message
					: "Failed to login. Try again",
			);
		}

		localStorage.setItem("token", loginData.access_token);
		setUser(registerData);
	};

	const checkAuth = async () => {
		const token = localStorage.getItem("token");
		if (token) {
			try {
				const { data } = await userService.getMe();

				if (!data) {
					localStorage.removeItem("token");
					throw new AuthError("Session expired");
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
