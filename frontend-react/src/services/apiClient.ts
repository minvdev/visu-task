import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "@/types/open-api-schema";
import { apiURL } from "@constants/api";

const authMiddleware: Middleware = {
	async onRequest({ request }) {
		const token = localStorage.getItem("token");
		if (token) {
			request.headers.set(
				"Authorization",
				`Bearer ${token}`,
			);
		}
		return request;
	},

	async onResponse({ schemaPath, response }) {
		if (schemaPath === "/auth/login") {
			return;
		}
		if (response.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/";
			throw new Error("Sesión expirada");
		}
		return response;
	},

	async onError({ error }) {
		console.error("API error:", error);
		throw error;
	},
};

export const client = createClient<paths>({
	baseUrl: apiURL,
});

client.use(authMiddleware);
