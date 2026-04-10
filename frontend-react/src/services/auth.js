import { apiFetch } from "./apiClient";

/**
 * API Service Layer for the "Auth" resource.
 * Here we centralize all URLs and HTTP methods.
 * No React component or hook should manually construct URLs.
 */
export const authService = {
	register: (username, email, password) =>
		apiFetch("/auth/register", {
			method: "POST",
			body: { username, email, password },
		}),

	login: (username, password) => {
		const formData = new FormData();
		formData.append("username", username);
		formData.append("password", password);

		return apiFetch("/auth/login", {
			method: "POST",
			body: formData,
		});
	},
};
