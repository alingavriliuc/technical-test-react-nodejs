const { getValueFromLocalStorage } = require("./localStorage");
const { LOCAL_STORAGE_JWT_KEY, API_URL } = require("../constants");

/**
 * Fetches messages from the server.
 * @returns {Promise<{ data: any, status: number }>} The response data containing the list of user messages and status.
 * @throws {Error} If there is an error while fetching the messages.
 */
exports.getMessages = async () => {
	try {
		const token = getValueFromLocalStorage(LOCAL_STORAGE_JWT_KEY);

		const response = await fetch(`${API_URL}/messages`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: token,
			},
		});

		const jsonData = await response.json();
		return { data: jsonData, status: response.status };
	} catch (error) {
		throw new Error("Error while logging in");
	}
};
