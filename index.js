require("dotenv").config();

const express = require("express");
// Creates express app
const app = express();
const bodyParser = require("body-parser");

// Env Vars used for Express server
const PORT = process.env.PORT || 3000;

// ROUTERS
const botRouter = require("./api/routers/botRouter");
const logsRouter = require("./api/routers/logsRouter");
const usersRouter = require("./api/routers/usersRouter");
const historyRouter = require("./api/routers/historyRouter");

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ROUTE MIDDLEWARE
app.use("/bot", botRouter);
app.use("/api/logs", logsRouter);
app.use("/api/users", usersRouter);
app.use("/api/history", historyRouter);

app.listen(PORT, function() {
  console.log("Bot is listening on port " + PORT);
});
