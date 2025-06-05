import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showWarning } from "../utils/alert";
import { authAPI } from "../api/api"; 

const AuthContext = createContext();
export { AuthContext };
export default AuthContext;

export const AuthProvider = ({ children }) => {
	// Import navigation hook from React Router
	const navigate = useNavigate();

	// Retrieve stored authentication tokens from localStorage
	const storedTokens = localStorage.getItem("authTokens");

	// Parse the tokens from JSON format (if they exist), otherwise set to null
	const parsedTokens = storedTokens ? JSON.parse(storedTokens) : null;

	// Initialize state for authentication tokens
	const [authTokens, setAuthTokens] = useState(parsedTokens);

	// Decode and store user information from access token if available
	const [user, setUser] = useState(parsedTokens ? jwtDecode(parsedTokens.access) : null);

	// Manage loading state for authentication handling
	const [loading, setLoading] = useState(true);

	const loginUser = async (email, password) => {
		try {
			const response = await authAPI.login({ email, password });
			console.log(response);
			
			const data = response.data;

			setAuthTokens(data);
			setUser(jwtDecode(data.access));
			localStorage.setItem("authTokens", JSON.stringify(data));
			navigate("/");

			showSuccess("Login Successful!", "Welcome back! You’re now logged in.");
		} catch (error) {
			if (error.response?.data?.detail) {
				showWarning("Oops!", error.response.data.detail);
			} else {
				showError("Login Failed", "Network or server error.");
			}
		}
	};

	const registerUser = async (userData) => {
		try {
			const response = await authAPI.register(userData);

			if (response.status === 201) {
				navigate("/login");
				showSuccess("Registration Successful", "Login now!");
			}
		} catch (error) {
			const errors = error.response?.data;
			const errorMessage = errors
				? Object.values(errors).flat().join(" ")
				: "Something went wrong.";
			showError("Registration Failed", errorMessage);
		}
	};

	const logoutUser = () => {
		setAuthTokens(null);
		setUser(null);
		localStorage.removeItem("authTokens");
		navigate("/login");
		showSuccess("You have been logged out");
	};

	useEffect(() => {
		if (authTokens) {
			setUser(jwtDecode(authTokens.access));
		}
		setLoading(false);
	}, [authTokens]);

	const contextData = {
		user,
		setUser,
		authTokens,
		setAuthTokens,
		registerUser,
		loginUser,
		logoutUser,
	};

	return (
		<AuthContext.Provider value={contextData}>
			{loading ? null : children}
		</AuthContext.Provider>
	);
};
