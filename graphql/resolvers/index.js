/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
const { UserInputError } = require("apollo-server-errors");

const userResolvers = require("./user");
const User = require("../../models/user");
const checkAuth = require("../../utils/checkAuth");
const { uuid } = require("uuidv4");

module.exports = {
  Query: {
    ...userResolvers.Query,
    async todos(_, { groupName }, context) {
      const { email } = checkAuth(context);

      if (!groupName) {
        throw new UserInputError("Group name must not be empty");
      }

      // no error thrown -> user authenticated
      const usr = await User.findOne({ email });

      return usr.groups.find((g) => g.name === groupName).todos;
    },
  },

  Mutation: {
    ...userResolvers.Mutation,
    async createGroup(_, { name }, context) {
      const { email } = checkAuth(context);

      if (!name) {
        throw new UserInputError("Group name must not be empty");
      }

      // no error thrown -> user authenticated
      const newGroup = {
        id: uuid(),
        name,
        todos: [],
        created: new Date().toISOString(),
      };

      const usr = await User.findOne({ email });

      usr.groups.push(newGroup);

      await usr.save();

      return newGroup;
    },
    // eslint-disable-next-line object-curly-newline
    async createTodo(
      _,
      // eslint-disable-next-line object-curly-newline
      { groupName, body, priority, remind, repeat, due },
      context
    ) {
      const { email } = checkAuth(context);

      if (!body) {
        throw new UserInputError("Todo body must not be empty");
      }
      // no error thrown -> user authenticated
      const newTodo = {
        id: uuid(),
        checked: false,
        body,
        priority,
        remind,
        repeat,
        due,
        created: new Date().toISOString(),
      };

      const usr = await User.findOne({ email });

      const group = usr.groups.find((g) => g.name === groupName);

      if (!group) throw new UserInputError("Group not found");

      group.todos.push(newTodo);

      await usr.save();
      return newTodo;
    },
    async editTodo(
      _,
      { groupId, todoId, checked, body, priority, remind, repeat, due },
      context
    ) {
      const { email } = checkAuth(context);

      const usr = await User.findOne({ email });

      const group = usr.groups.find((group) => group.id === groupId);

      if (!group) throw new UserInputError("Group not found");

      const todo = group.todos.find((todo) => todo.id === todoId);

      if (!todo) throw new UserInputError("Todo not found");

      todo.checked = checked ? checked : todo.checked;
      todo.body = body ? body : todo.body;
      todo.priority = priority ? priority : todo.priority;
      todo.checked = remind ? remind : todo.remind;
      todo.checked = repeat ? repeat : todo.repeat;
      todo.checked = due ? due : todo.due;

      await usr.save();

      return todo;
    },
  },
};
