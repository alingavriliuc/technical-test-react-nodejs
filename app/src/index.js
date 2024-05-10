import "./index.css";

import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/login";
import Signup from "./components/signup";
import Messages from "./components/messages";

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route element={<Messages />} path="/" exact />
					<Route element={<Login />} path="/login" />
					<Route element={<Signup />} path="/signup" />
				</Routes>
			</Router>
		</div>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
