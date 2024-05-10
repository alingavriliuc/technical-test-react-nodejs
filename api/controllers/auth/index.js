const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/");
const { userSchema } = require("../../schema");

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

		res.status(201).json({ user: newUser });
	} catch (error) {
		console.error("Error occured during signup :", error);
		res.status(500).json({ error: "Error occured during signup." });
	}
};
