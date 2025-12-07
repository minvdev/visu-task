const API_URL = "http://localhost:8080";
export const apiFetch = async (endpoint, options = {}) => {
	const headers = { ...options.headers };

	const token = localStorage.getItem("token");
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	let { body } = options;

	const isLogin = body && body instanceof FormData;

	if (isLogin) {
		// Let the browser fill the content-type
	} else if (body && typeof body === "object") {
		body = JSON.stringify(body);
		headers["Content-Type"] = "application/json";
	}

	const config = {
		...options,
		headers,
		body,
	};

	try {
		const response = await fetch(
			`${API_URL}${endpoint}`,
			config
		);

		if (response.status === 401) {
			window.location.href = "/";
			localStorage.removeItem("token");
			throw new Error(
				isLogin
					? "Usuario o contraseña incorrecta"
					: "Sesión expirada"
			);
		}

		if (!response.ok) {
			const errorData = await response
				.json()
				.catch(() => ({}));
			throw new Error(
				errorData.detail || "Error en la petición"
			);
		}

		if (response.status === 204) return null;

		return await response.json();
	} catch (error) {
		console.log("Error en apiFetch:", error);
		throw error;
	}
};
