/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");

const User = require("../../models/user");
const { SECRET_KEY } = require("../../config");
const validateInput = require("../../utils/validateInput");
const checkAuth = require("../../utils/checkAuth");

const generateToken = (user) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    // eslint-disable-next-line comma-dangle
    { expiresIn: "1h" }
  );

module.exports = {
  Query: {
    async userInfo(_, _2, context) {
      try {
        const { email } = checkAuth(context);

        const user = await User.findOne({ email });

        return user;
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async login(_, { email, password }) {
      const { errors, valid } = validateInput(email, password, false);
      const user = await User.findOne({ email });

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(_, { email, password, confirmPassword }) {
      // Validate user data

      const { valid, errors } = validateInput(email, password, confirmPassword);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // TODO Make sure user doesn't already exist

      const user = await User.findOne({ email });
      if (user) {
        throw new UserInputError("Email is taken", {
          errors: {
            email: "This email is taken",
          },
        });
      }

      // TODO hash pasword and create an authentication token
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        password: hashedPassword,
        created: new Date().toISOString(),
        groups: [],
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
