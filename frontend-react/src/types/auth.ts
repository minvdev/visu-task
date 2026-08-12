import { type components } from "@/types/open-api-schema";
export type User = components["schemas"]["User"];

export interface AuthContextType {
	user: User | null;
	login: (
		username: string,
		password: string,
	) => Promise<LoginResult>;
	logout: () => Promise<void>;
	register: (
		username: string,
		email: string,
		password: string,
	) => Promise<RegisterResult>;
	isLoading: boolean;
}

export type RegisterResult = void;

export type LoginResult = void;
