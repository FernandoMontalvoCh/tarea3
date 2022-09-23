const express = require("express");

//Controllers
const {
  createConsole,
  getAllConsoles,
  updateConsole,
  deleteConsole,
} = require("../controllers/consoles.controller");

//Middleware
const { protectSession } = require('../middlewares/auth.middlewares');
const { consoleExist } = require('../middlewares/consoles.middlewares');

const consolesRouter = express.Router();

consolesRouter.get("/", getAllConsoles);

consolesRouter.use(protectSession);

consolesRouter.post("/", createConsole);

consolesRouter.patch("/:id", updateConsole);

consolesRouter.delete("/:id", deleteConsole);

module.exports = { consolesRouter };
