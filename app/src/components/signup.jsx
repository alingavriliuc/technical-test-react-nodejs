import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const { signup, logout } = require("../services/auth");

const { signupSchema } = require("../schema");

const Signup = () => {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [errors, setErrors] = useState({});
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
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
			signupSchema.parse(formData);

			signup(formData)
				.then(({ error }) => {
					if (error) {
						setError(error);
						return;
					}

					navigate("/login");
				})
				.catch((error) => {
					console.error("Erreur:", error);
				});
		} catch (error) {
			setErrors(error?.formErrors?.fieldErrors);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register</h2>
				</div>

				{error && <div className="text-red-500 text-center">{error}</div>}

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<input type="hidden" name="remember" value="true" />
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<input
								type="email"
								id="email"
								name="email"
								required
								value={formData?.email}
								onChange={handleChange}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="example@mail.com"
							/>
							{errors?.email && (
								<span style={{ color: "red" }} className="text-xs">
									{errors.email}
								</span>
							)}
						</div>
						<div className="py-4">
							<input
								id="password"
								name="password"
								autoComplete="new-password"
								value={formData?.password}
								required
								type="password"
								onChange={handleChange}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="password"
							/>
							{errors?.password && (
								<span style={{ color: "red" }} className="text-xs">
									{errors.password}
								</span>
							)}
						</div>
						<div>
							<input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								value={formData?.confirmPassword}
								required
								onChange={handleChange}
								className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								placeholder="confirm password"
							/>
							{errors?.confirmPassword && (
								<span style={{ color: "red" }} className="text-xs">
									{errors.confirmPassword}
								</span>
							)}
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Create your account
						</button>
					</div>

					<div className="flex items-center justify-center">
						<div className="text-sm">
							<Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
								Already have an account? Login
							</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Signup;
