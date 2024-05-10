const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { login, signup } = require("./index");
const { Message, User } = require("../../models");

const mockRequest = (body) => ({
	body,
});

const mockResponse = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

jest.mock("../../models");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("login function", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return a success message and token on successful login", async () => {
		const req = mockRequest({ email: "test@example.com", password: "password123" });
		const res = mockResponse();
		const mockUser = { id: 1, email: "test@example.com", password: "hashedPassword" };
		User.findOne.mockResolvedValue(mockUser);
		bcrypt.compare.mockResolvedValue(true);
		jwt.sign.mockReturnValue("mockedToken");

		await login(req, res);

		expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
		expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPassword");
		expect(jwt.sign).toHaveBeenCalledWith({ email: "test@example.com", userId: 1 }, process.env.JWT_SECRET);
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ token: "mockedToken" });
	});

	it("should return an error message when email is not found", async () => {
		const req = mockRequest({ email: "nonexistent@example.com", password: "password123" });
		const res = mockResponse();
		User.findOne.mockResolvedValue(null);

		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	it("should return an error message when password is incorrect", async () => {
		const req = mockRequest({ email: "test@example.com", password: "incorrectPassword" });
		const res = mockResponse();
		const mockUser = { id: 1, email: "test@example.com", password: "hashedPassword" };
		User.findOne.mockResolvedValue(mockUser);
		bcrypt.compare.mockResolvedValue(false);

		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
	});

	it("should return an error message when an error occurs during login", async () => {
		const req = mockRequest({ email: "test@example.com", password: "password123" });
		const res = mockResponse();
		User.findOne.mockRejectedValue(new Error("Database error"));

		await login(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

describe("signup function", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should create a new user and return status 201 on successful signup", async () => {
		const req = mockRequest({ email: "test@example.com", password: "password123" });
		const res = mockResponse();
		const mockUser = { id: 1, email: "test@example.com", password: "hashedPassword" };
		User.findOne.mockResolvedValue(null);
		bcrypt.hash.mockResolvedValue("hashedPassword");
		User.create.mockResolvedValue(mockUser);

		await signup(req, res);

		expect(User.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
		expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
		expect(User.create).toHaveBeenCalledWith({ email: "test@example.com", password: "hashedPassword" });
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ user: mockUser });
	});

	it("should return an error message when email already exists", async () => {
		const req = mockRequest({ email: "existing@example.com", password: "password123" });
		const res = mockResponse();
		const existingUser = { id: 1, email: "existing@example.com", password: "hashedPassword" };
		User.findOne.mockResolvedValue(existingUser);

		await signup(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});

	it("should return an error message when User.findOne throws an error", async () => {
		const req = mockRequest({ email: "test@example.com", password: "password123" });
		const res = mockResponse();
		User.findOne.mockRejectedValue(new Error("Database error"));

		await signup(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return an error message when bcrypt.hash throws an error", async () => {
		const req = mockRequest({ email: "test@example.com", password: "password123" });
		const res = mockResponse();
		User.findOne.mockResolvedValue(null);
		bcrypt.hash.mockRejectedValue(new Error("Hashing error"));

		await signup(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});

	it("should return an error message when required fields are missing", async () => {
		const req = mockRequest({ password: "password123" });
		const res = mockResponse();

		await signup(req, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});
});
