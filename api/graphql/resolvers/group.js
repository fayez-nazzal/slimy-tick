/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
const { UserInputError } = require('apollo-server-errors');
const User = require('../../models/user');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
  Query: {
  },

  Mutation: {
    async createGroup(_, { name }, { req }) {
      const token = req.cookies['slimytick-jwt'];

      const { email } = checkAuth(token);

      if (!name) {
        throw new UserInputError('Group name must not be empty');
      }

      // no error thrown -> user authenticated
      const newGroup = {
        name,
        tasks: [],
        created: new Date().toISOString(),
      };

      const usr = await User.findOne({ email });

      usr.groups.push(newGroup);

      await usr.save();

      return newGroup;
    }
  }
};
