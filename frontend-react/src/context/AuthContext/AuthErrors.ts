export class AuthError extends Error {
	constructor(
		message?: string | undefined,
		options?: ErrorOptions | undefined,
	) {
		super(message, options);
		this.name = "AuthError";
	}
}
