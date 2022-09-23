// Models
const { Game } = require("../models/game.model");
const { Review } = require("../models/review.model");
const { Console } = require("../models/console.model");
const { User } = require("../models/user.model");
const { GameInConsole } = require("../models/gameInConsole.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

const getAllGames = catchAsync(async (req, res, next) => {
  const games = await Game.findAll({
    where: { status: "active" },
    include: [
      {
        model: Review,
        include: { model: User, attributes: { exclude: ["password"] } },
      },
      { model: Console },
    ],
  });

  res.status(200).json({
    status: "success",
    data: { games },
  });
});

const createGame = catchAsync(async (req, res, next) => {
  const { title, genre, consoleId } = req.body;

  const newGame = await Game.create({ title, genre });

  // Assign game in console
  await GameInConsole.create({ consoleId, gameId: newGame.id });

  res.status(201).json({
    status: "success",
    data: { newGame },
  });
});

const updateGame = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const { game } = req;

  await game.update({ title });

  res.status(200).json({
    status: "success",
    data: { game },
  });
});

const deleteGame = catchAsync(async (req, res, next) => {
  const { game } = req;

  await game.update({ status: "deleted" });

  res.status(204).json({
    status: "success",
  });
});

const createReview = catchAsync(async (req, res, next) => {
  const { gameId } = req.params;
  const { comment } = req.body;
  const { sessionUser } = req;

  const newReview = await Review.create({
    userId: sessionUser.id,
    gameId,
    comment,
  });

  res.status(201).json({
    status: "success",
    data: { newReview },
  });
});

module.exports = {
  getAllGames,
  createGame,
  updateGame,
  deleteGame,
  createReview,
};
