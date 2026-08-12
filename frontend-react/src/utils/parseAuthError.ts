import {
	HTTPError,
	ValidationError,
	ParsedAuthError,
} from "@/types/auth";

export function parseAuthError(
	error: ValidationError | HTTPError,
): ParsedAuthError {
	const { detail } = error;

	if (Array.isArray(detail)) {
		// HTTPValidationError
		return parseValidationError(detail);
	}

	return { general: detail || "Unexpected error" };
}

function parseValidationError(
	detail: ValidationError["detail"],
): ParsedAuthError {
	const payload: ParsedAuthError = {};
	if (!detail || detail.length === 0)
		return {
			general: "Unexpected error",
		};

	for (const item of detail) {
		const field = item.loc[1]; // Assumes FastAPI loc format: ["body", "field_name"]
		const msg = item.msg;

		if (
			typeof field === "string" &&
			["username", "email", "password"].includes(field)
		) {
			payload[field as keyof typeof payload] = msg;
		} else payload.general = msg;
	}

	return payload;
}
