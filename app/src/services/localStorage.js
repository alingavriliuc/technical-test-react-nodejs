/**
 * Sets a value to the local storage.
 * @param {string} key - The key to set the value for.
 * @param {any} value - The value to be set.
 */
exports.setValuetoLocalStorage = (key, value) => {
	localStorage.setItem(key, value);
};

/**
 * Retrieves a value from the local storage.
 * @param {string} key - The key to retrieve the value for.
 * @returns {any} The retrieved value.
 */
exports.getValueFromLocalStorage = (key) => {
	return localStorage.getItem(key);
};

/**
 * Removes a value from the local storage.
 * @param {string} key - The key to remove the value for.
 */
exports.removeValueFromLocalStorage = (key) => {
	localStorage.removeItem(key);
};
