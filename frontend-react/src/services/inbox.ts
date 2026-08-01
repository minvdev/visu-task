import { client } from "./apiClient";

/**
 * API Service Layer for the "Inbox" resource.
 * Here we centralize all URLs and HTTP methods.
 * No React component or hook should manually construct URLs.
 */
export const inboxService = {
	getInbox: () => client.GET("/inbox"),
};
