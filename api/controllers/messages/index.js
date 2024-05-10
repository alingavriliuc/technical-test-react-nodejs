const { Message, User } = require("../../models");
const { messageSchema } = require("../../schema");

/**
 * @api {get} /messages Get User Messages
 * @apiName GetMessages
 * @apiGroup Messages
 *
 * @apiHeader {String} Authorization User's JWT token.
 *
 * @apiSuccess {Array} messages Array of user's messages.
 * @apiSuccess {String} messages.id Message ID.
 * @apiSuccess {String} messages.content Message content.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "messages": [
 *           {
 *               "id": "1",
 *               "content": "Hello, world!"
 *           },
 *           {
 *               "id": "2",
 *               "content": "How are you?"
 *           }
 *       ]
 *     }
 *
 * @apiError (401 Unauthorized) UserNotAuthenticated User not authenticated.
 * @apiError (404 Not Found) UserNotFound User not found.
 * @apiError (500 Internal Server Error) ServerError Error while trying to get user messages.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "User not authenticated."
 *     }
 */
exports.getMessages = async (req, res) => {
	try {
		const userId = req?.user?.userId;

		if (!userId) {
			return res.status(401).json({ error: "User not authenticated." });
		}

		// Find the user by userId
		const user = await User.findByPk(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// Using the association method to get the user's messages
		const messages = await user.getMessages();

		res.status(200).json({ messages });
	} catch (error) {
		console.error("Error while trying to get user messages:", error);
		res.status(500).json({ error: "Error while trying to get user messages." });
	}
};

/**
 * @api {post} /messages Create Message
 * @apiName CreateMessage
 * @apiGroup Messages
 *
 * @apiHeader {String} Authorization User's JWT token.
 *
 * @apiParam {String} content Message content.
 *
 * @apiSuccess {Object} message Newly created message object.
 * @apiSuccess {String} message.id Message ID.
 * @apiSuccess {String} message.content Message content.
 * @apiSuccess {String} message.userId ID of the user who created the message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": {
 *           "id": "1",
 *           "content": "Hello, world!",
 *           "userId": "1234567890"
 *       }
 *     }
 *
 * @apiError (400 Bad Request) MissingContent Message content is required.
 * @apiError (401 Unauthorized) UserNotAuthenticated User not authenticated.
 * @apiError (500 Internal Server Error) ServerError Error while trying to create a message.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Message content is required."
 *     }
 */
exports.createMessage = async (req, res) => {
	try {
		const userId = req?.user?.userId;
		const { content } = req.body;

		if (!userId) {
			return res.status(401).json({ error: "User not authenticated." });
		}

		if (!content) {
			return res.status(400).json({ error: "Message content is required." });
		}

		// Validate schema
		try {
			messageSchema.parse({ content });
		} catch (validationError) {
			return res.status(400).json({ error: validationError.errors });
		}

		const message = await Message.create({ content, userId });

		res.status(201).json({ message });
	} catch (error) {
		console.error("Error while trying to create a message :", error);
		res.status(500).json({ error: "Error while trying to create a message." });
	}
};
