require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const api = require("./api");

const app = express();
const authorizedDomains = ["http://localhost:3000"];

/**
 * @PILOT
 * corsOptions are set to allow V2 server to communicate with V3, remove when V3 is deployed on all poles
 */
const corsOptions = {
	origin(origin, callback) {
		if (!origin || authorizedDomains.includes(origin)) {
			callback(null, true);
			return;
		}
		console.warn(`An unauthorized request was made to the API by : ${origin}`);
		callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(api);

module.exports = app;
