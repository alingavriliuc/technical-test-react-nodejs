const { LOCAL_STORAGE_JWT_KEY, API_URL } = require("../constants");
const { removeValueFromLocalStorage } = require("./localStorage");

/**
 * Logs in the user by sending a POST request to the login API endpoint.
 * @param {Object} data - The login data.
 * @returns {Promise<Response>} - A promise that resolves to the response from the API.
 */
exports.login = async (data) => {
	try {
		const response = await fetch(`${API_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const jsonData = await response.json();

		return { token: jsonData.token, error: jsonData.error };
	} catch (error) {
		throw new Error("Error while logging in");
	}
};

/**
 * Signs out the user by sending a POST request to the signup API endpoint.
 * @param {Object} data - The signout data.
 * @returns {Promise<Response>} - A promise that resolves to the response from the API.
 */
exports.signup = async (data) => {
	const response = await fetch(`${API_URL}/signup`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	const jsonData = await response.json();

	return { error: jsonData.error };
};

/**
 * Logs out the user by sending a POST request to the logout API endpoint.
 * @returns {Promise<Response>} - A promise that resolves to the response from the API.
 */
exports.logout = async () => {
	removeValueFromLocalStorage(LOCAL_STORAGE_JWT_KEY);
};
