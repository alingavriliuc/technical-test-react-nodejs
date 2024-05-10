const { Message, User } = require("../../models");
const { messageSchema } = require("../../schema");

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

		res.json(messages);
	} catch (error) {
		console.error("Error while trying to get user messages:", error);
		res.status(500).json({ error: "Error while trying to get user messages." });
	}
};

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

		res.json(message);
	} catch (error) {
		console.error("Error while trying to create a message :", error);
		res.status(500).json({ error: "Error while trying to create a message." });
	}
};
