import { components } from "@/types/open-api-schema";
import { authService } from "@services/auth";
import { userService } from "@services/user";
import {
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
type User = components["schemas"]["User"];

interface AuthContextType {
	user: User | null;
	login: (
		username: string,
		password: string,
	) => Promise<void>;
	logout: () => Promise<void>;
	register: (
		username: string,
		email: string,
		password: string,
	) => Promise<void>;
	isLoading: boolean;
}

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
	) => {
		const { data, error } = await authService.login({
			username,
			password,
		});

		if (error || !data)
			throw error || new Error("Failed to login");

		localStorage.setItem("token", data.access_token);

		const { data: userData, error: userError } =
			await userService.getMe();

		if (userError || !userData)
			throw (
				userError ||
				new Error("Failed to get user in order to login")
			);

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
	) => {
		const { data, error } = await authService.register({
			username,
			email,
			password,
		});

		if (error || !data)
			throw error || new Error("Failed to register");

		await login(username, password);
	};

	const checkAuth = async () => {
		const token = localStorage.getItem("token");
		if (token) {
			const { data, error } = await userService.getMe();

			if (error || !data) {
				console.error(
					"Authorization checking failed: ",
					error,
				);
				localStorage.removeItem("token");
			}

			if (data) setUser(data);
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
