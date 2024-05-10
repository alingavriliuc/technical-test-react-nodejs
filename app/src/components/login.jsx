import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { login, logout } = require("../services/auth");
const { LOCAL_STORAGE_JWT_KEY } = require("../constants");
const { setValuetoLocalStorage } = require("../services/localStorage");

const { loginSchema } = require("../schema");

const Login = () => {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	// Delete the token from the local storage when the user logs out
	logout();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		setErrors({});

		try {
			loginSchema.parse(formData);

			login(formData)
				.then(({ token, error }) => {
					if (error) {
						setError(error);
						return;
					}

					navigate("/");
					setValuetoLocalStorage(LOCAL_STORAGE_JWT_KEY, token);
				})
				.catch((error) => {
					setError("An error occured while logging in.");
				});
		} catch (error) {
			setErrors(error?.formErrors?.fieldErrors);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Login</h2>
				</div>

				{error && <div className="text-red-500 text-center">{error}</div>}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<input type="hidden" name="remember" value="true" />
					<div className="rounded-md shadow-sm -space-y-px">
						<div className="mb-4">
							<label htmlFor="email-address" className="sr-only">
								Email
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								autoComplete="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="example@mail.com"
							/>
							{errors.email && (
								<span style={{ color: "red" }} className="text-xs">
									{errors.email}
								</span>
							)}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Mot de passe
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								autoComplete="current-password"
								required
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="Password"
							/>
							{errors.password && (
								<span style={{ color: "red" }} className="text-xs">
									{errors.password}
								</span>
							)}
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Login
						</button>
					</div>

					<div className="flex items-center justify-center">
						<div className="text-sm">
							<Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
								Don't have an account yet ? Sign up
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
