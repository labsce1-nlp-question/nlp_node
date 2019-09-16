require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
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
const authRouter = require("./api/routers/authrouter.js");
const questionRouter = require('./api/routers/questionRouter.js');

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet()); // hides your tech stack from sniffers
app.use(cors()); // allows domains/ports to connect to your server

// Root url
app.get('/', (req, res) => {
  res.send("Server is running!");
});

// ROUTE MIDDLEWARE
app.use("/bot", botRouter);
app.use("/api/logs", logsRouter);
app.use("/api/users", usersRouter);
app.use("/api/history", historyRouter);
app.use("/api/auth", authRouter);
app.use("/api/question", questionRouter);

app.listen(PORT, function() {
  console.log("Bot is listening on port " + PORT);
});
