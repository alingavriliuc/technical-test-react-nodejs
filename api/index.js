const app = require("./app");
const db = require("./models");

// Sync the database
db.sequelize.sync().then(() => {
	console.log("Database synced");
});

// Start the server
app.listen(3001, () => {
	console.log(`Api started on port ${3001}`);
});
