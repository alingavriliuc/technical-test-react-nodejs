import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { logout } = require("../services/auth");
const { getMessages } = require("../services/messages");

const Messages = () => {
	const navigate = useNavigate();
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getMessages()
			.then((response) => {
				if (response.status === 401 || response.status === 403) {
					handleLogout();
				}

				if (response?.data?.error) {
					setError(response.data.error);
					return;
				}

				const messagesList = response?.data?.messages || [];
				setMessages(messagesList);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	const handleLogout = () => {
		logout().then(() => {
			navigate("/login");
		});
	};

	if (loading) {
		return <div className="max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded">Loading...</div>;
	}

	return (
		<div className="max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded">
			<h2 className="text-xl font-semibold mb-4">Messages list</h2>
			{!messages || messages.length === 0 ? (
				<p>Empty.</p>
			) : (
				<ul>
					{messages.length > 0 &&
						messages.map((message) => (
							<li key={message.id} className="border-b py-2">
								{message.content}
							</li>
						))}
				</ul>
			)}
			<button onClick={handleLogout} className="mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded">
				Logout
			</button>
			{error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
		</div>
	);
};

export default Messages;
