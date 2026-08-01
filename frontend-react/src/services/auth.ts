import { client } from "@services/apiClient";
import type { paths } from "@/types/open-api-schema";

type RegisterBody =
	paths["/auth/register"]["post"]["requestBody"]["content"]["application/json"];
type LoginBody =
	paths["/auth/login"]["post"]["requestBody"]["content"]["application/x-www-form-urlencoded"];

/**
 * API Service Layer for the "Auth" resource.
 * Here we centralize all URLs and HTTP methods.
 * No React component or hook should manually construct URLs.
 */
export const authService = {
	register: (body: RegisterBody) =>
		client.POST("/auth/register", { body }),

	login: (body: LoginBody) =>
		client.POST("/auth/login", {
			body,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		}),
};
