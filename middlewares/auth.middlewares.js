const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

//Model
const { User } = require("../models/user.model");

//Utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");

dotenv.config({ path: "./config.env" });

const protectSession = catchAsync(async (req, res, next) => {
    // Get Token
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Extrac token // req.headers.authorization = ' Bearer token '
      token = req.headers.authorization.split(" ")[1]; // -> [Bearer, token]
    }

    // Check if the token was sent or not
    if (!token) {
      return next(new AppError('Invalid session', 403));
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verify the token owner
    const user = await User.findOne({
      where: { id: decoded.id, status: "active" },
    });

    if (!user) {
      return next(new AppError('The owner of the session is no longer active', 403));
    }

    // Grant access
    req.sessionUser = user; // nos permite saber quien es el usuario que realiza las peticiones(token)
    next();
});

const protectUserAccount = (req, res, next) => {
  const { sessionUser, user } = req;

  if (sessionUser.id !== user.id) {
    return next(new AppError('You are not the owner of this account', 403));
  }

  next();
};

const grantAccessToUsers = (req, res, next) => {
  const { sessionUser } = req;

  if (sessionUser.role !== "admin") {
    return next(new AppError('Invalid role', 403));
  }

  next();
};

module.exports = {
  protectSession,
  protectUserAccount,
  grantAccessToUsers,
};
