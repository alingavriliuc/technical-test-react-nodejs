const messagesController = require("../../controllers/messages");
const checkToken = require("../../middleweares/checkToken");

module.exports = [
	{
		route: "/messages",
		method: "GET",
		controller: messagesController.getMessages,
		middlewares: [checkToken],
	},
	{
		route: "/create-message",
		method: "POST",
		controller: messagesController.createMessage,
		middlewares: [checkToken],
	},
];
