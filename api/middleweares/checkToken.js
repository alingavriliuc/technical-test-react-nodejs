const jwt = require("jsonwebtoken");

/**
 * Middleware function to check the validity of a JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
const checkToken = async (req, res, next) => {
	const token = req.headers["authorization"];

	if (!token) return res.status(401).json({ error: "Missing JWT Token" });

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) return res.status(403).json({ error: "Invalid JWT Token" });
		req.user = decoded;
		next();
	});
};

module.exports = checkToken;
