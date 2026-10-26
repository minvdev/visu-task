import { client } from "./apiClient";

/**
 * API Service Layer for the "User" resource.
 * Here we centralize all URLs and HTTP methods.
 * No React component or hook should manually construct URLs.
 */
export const userService = {
	getMe: () => client.GET("/users/me"),
};
