const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/");
const { userSchema } = require("../../schema");

/**
 * @api {post} /login Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 *
 * @apiSuccess {String} token JWT token for authentication.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVtYWlsQGV4YW1wbGUuY29tIiwidXNlcklkIjoiMTIzNDU2Nzg5MCIsImlhdCI6MTUxNjIzOTAyMn0.7NJ4CGYs0HG5Rn7XVdA9DZpPj6Tu_klZO7bBM2nGoo0"
 *     }
 *
 * @apiError (400 Bad Request) MissingFields Both email and password are required.
 * @apiError (401 Unauthorized) WrongPassword Incorrect password.
 * @apiError (404 Not Found) UserNotFound User not found.
 * @apiError (500 Internal Server Error) ServerError An error occurred on login.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Wrong password"
 *     }
 */
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Validate schema
		try {
			userSchema.parse({ email, password });
		} catch (validationError) {
			return res.status(400).json({ error: validationError.errors });
		}

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(401).json({ error: "Wrong  password" });
		}

		const token = jwt.sign({ email: user.email, userId: user.id }, process.env.JWT_SECRET);

		res.status(200).json({ token });
	} catch (error) {
		console.error("En error occured on login :", error);
		res.status(500).json({ error: "En error occured on login." });
	}
};

/**
 * @api {post} /signup Signup
 * @apiName Signup
 * @apiGroup Authentication
 *
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 Created
 *     {}
 *
 * @apiError (400 Bad Request) MissingFields Both email and password are required.
 * @apiError (400 Bad Request) EmailExists The provided email is already in use.
 * @apiError (500 Internal Server Error) ServerError An error occurred during signup.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "This email is already used"
 *     }
 */
exports.signup = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: "Email and password are required" });
		}

		// Validate schema
		try {
			userSchema.parse({ email, password });
		} catch (validationError) {
			return res.status(400).json({ error: validationError.errors });
		}

		const userExists = await User.findOne({ where: { email } });
		if (userExists) {
			return res.status(400).json({ error: "This email is already used" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({ email, password: hashedPassword });

		res.status(201).send();
	} catch (error) {
		console.error("Error occured during signup :", error);
		res.status(500).json({ error: "Error occured during signup." });
	}
};
