const { getMessages, createMessage } = require("./index");
const { Message, User } = require("../../models");

jest.mock("../../models");

describe("messages controller", () => {
	describe("getMessages", () => {
		it("should return user messages if user is authenticated", async () => {
			const req = { user: { userId: 1 } };
			const res = { json: jest.fn() };

			User.findByPk.mockResolvedValueOnce({ getMessages: jest.fn().mockResolvedValueOnce(["message1", "message2"]) });

			await getMessages(req, res);

			expect(User.findByPk).toHaveBeenCalledWith(1);
			expect(res.json).toHaveBeenCalledWith(["message1", "message2"]);
		});

		it("should return 401 if user is not authenticated", async () => {
			const req = {};
			const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

			await getMessages(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
		});

		it("should return 404 if user is not found", async () => {
			const req = { user: { userId: 1 } };
			const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

			User.findByPk.mockResolvedValueOnce(null);

			await getMessages(req, res);

			expect(User.findByPk).toHaveBeenCalledWith(1);
			expect(res.status).toHaveBeenCalledWith(404);
		});
	});

	describe("createMessage", () => {
		it("should create a new message if user is authenticated and content is provided", async () => {
			const req = { user: { userId: 1 }, body: { content: "Hello, world!" } };
			const res = { json: jest.fn() };

			Message.create.mockResolvedValueOnce("newMessage");

			await createMessage(req, res);

			expect(Message.create).toHaveBeenCalledWith({ content: "Hello, world!", userId: 1 });
			expect(res.json).toHaveBeenCalledWith("newMessage");
		});

		it("should return 401 if user is not authenticated", async () => {
			const req = { body: { content: "Hello, world!" } };
			const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

			await createMessage(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
		});

		it("should return 400 if content is not provided", async () => {
			const req = { user: { userId: 1 }, body: {} };
			const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

			await createMessage(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("should return 500 if an error occurs", async () => {
			const req = { user: { userId: 1 }, body: { content: "Hello, world!" } };
			const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

			Message.create.mockRejectedValueOnce("Database error");

			await createMessage(req, res);

			expect(Message.create).toHaveBeenCalledWith({ content: "Hello, world!", userId: 1 });
			expect(res.status).toHaveBeenCalledWith(500);
		});
	});
});