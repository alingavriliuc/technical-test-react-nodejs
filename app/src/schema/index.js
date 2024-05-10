/**
 * Using Zod to validate the input data
 */

const { z } = require("zod");

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(6, "The password must be at least 6 characters long"),
});

const signupSchema = z
	.object({
		email: z.string().email("Please enter a valid email address"),
		password: z.string().min(6, "Password must be at least 6 characters long"),
		confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

module.exports = { loginSchema, signupSchema };
