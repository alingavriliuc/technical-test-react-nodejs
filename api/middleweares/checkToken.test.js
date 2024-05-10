const jwt = require("jsonwebtoken");
const checkToken = require("./checkToken");

describe("checkToken middleware", () => {
	it("should return 401 if JWT token is missing", () => {
		const req = { headers: {} };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		const next = jest.fn();

		checkToken(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(next).not.toHaveBeenCalled();
	});

	it("should return 403 if JWT token is invalid", () => {
		const req = { headers: { authorization: "invalid-token" } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		const next = jest.fn();

		jwt.verify = jest.fn((token, secret, callback) => {
			callback(new Error("Invalid token"));
		});

		checkToken(req, res, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(next).not.toHaveBeenCalled();
	});

	it("should set the decoded user object in the request and call next if JWT token is valid", () => {
		const req = { headers: { authorization: "valid-token" } };
		const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
		const next = jest.fn();

		jwt.verify = jest.fn((token, secret, callback) => {
			callback(null, { email: "testuser@mail.com" });
		});

		checkToken(req, res, next);

		expect(req.user).toEqual({ email: "testuser@mail.com" });
		expect(next).toHaveBeenCalled();
	});
});
