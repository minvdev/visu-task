import { type components } from "@/types/open-api-schema";
export type User = components["schemas"]["User"];
export type HTTPError = components["schemas"]["HTTPError"];
export type ValidationError =
	components["schemas"]["HTTPValidationError"];

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

export interface RegisterFormError {
	general?: string | undefined;
	username?: string | undefined;
	email?: string | undefined;
	password?: string | undefined;
}
export interface LoginFormError {
	general?: string | undefined;
	username?: string | undefined;
	password?: string | undefined;
}

export type ParsedAuthError =
	| RegisterFormError
	| LoginFormError;

export type RegisterResult =
	| { success: true }
	| { success: false; error: RegisterFormError };

export type LoginResult =
	| { success: true }
	| { success: false; error: LoginFormError };
