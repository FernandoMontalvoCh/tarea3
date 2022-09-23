const { User } = require("../models/user.model");
const { Review } = require("../models/review.model");
const { Game } = require("../models/game.model");
const { Console } = require("../models/console.model");

const initModels = () => {
  // 1 User <-> M Reviews
  User.hasMany(Review, { foreignKey: "userId" });
  Review.belongsTo(User);

  // 1 Game <-> M Reviews
  Game.hasMany(Review, { foreignKey: "gameId" });
  Review.belongsTo(Game);

  // M Game <-> M Console
  Game.belongsToMany(Console, {
    through: 'gameInConsole',
    foreignKeys: 'gameId',
  });
  Console.belongsToMany(Game, {
    through: 'gameInConsole',
    foreignKeys: 'consoleId',
  });
  
};

module.exports = { initModels };
