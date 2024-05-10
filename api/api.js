const api = require("express").Router();
const routes = require("./routes");

/**
 * Dynamically add routes to the API
 */

routes.forEach((route) => {
	const { route: path, method, controller } = route;
	const middlewares = route.middlewares || [];
	api[method.toLowerCase()](path, ...middlewares, controller);
});

module.exports = api;
