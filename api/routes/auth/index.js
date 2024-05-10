const authController = require("../../controllers/auth");

module.exports = [
	{
		route: "/login",
		method: "POST",
		controller: authController.login,
	},
	{
		route: "/signup",
		method: "POST",
		controller: authController.signup,
	},
];
