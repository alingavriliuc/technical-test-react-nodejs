/**
 * Using Zod to validate the request body
 */

const { z } = require("zod");

const userSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z.string().min(6, "Password should be longer than 6 characters"),
});

const messageSchema = z.object({
	content: z.string().min(1, "Message content sould be longer than 1 character").max(500, "Message content should be shorter than 500 characters"),
});

module.exports = { userSchema, messageSchema };
