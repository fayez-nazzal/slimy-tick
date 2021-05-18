/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
const { UserInputError } = require('apollo-server-errors');

const userResolvers = require('./user');
const groupResolvers = require('./group');
const taskResolvers = require('./task');
const User = require('../../models/user');
const checkAuth = require('../../utils/checkAuth');
const { uuid } = require('uuidv4');

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...groupResolvers.Query,
    ...taskResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...groupResolvers.Mutation,
    ...taskResolvers.Mutation,
  },
};
