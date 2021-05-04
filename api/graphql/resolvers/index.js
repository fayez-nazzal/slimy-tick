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
    async tasks(_, { groupName }, context) {
      const { email } = checkAuth(context);

      if (!groupName) {
        throw new UserInputError("Group name must not be empty");
      }

      // no error thrown -> user authenticated
      const usr = await User.findOne({ email });

      return usr.groups.find((g) => g.name === groupName).tasks;
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
        tasks: [],
        created: new Date().toISOString(),
      };

      const usr = await User.findOne({ email });

      usr.groups.push(newGroup);

      await usr.save();

      return newGroup;
    },
    // eslint-disable-next-line object-curly-newline
    async createtask(
      _,
      // eslint-disable-next-line object-curly-newline
      { groupName, body, priority, remind, repeat, dueDate, dueTime },
      context
    ) {
      const { email } = checkAuth(context);

      if (!body) {
        throw new UserInputError("task body must not be empty");
      }
      // no error thrown -> user authenticated
      const newtask = {
        id: uuid(),
        checked: false,
        body,
        priority,
        remind,
        repeat,
        dueDate,
        dueTime,
        created: new Date().toISOString(),
      };

      const usr = await User.findOne({ email });

      const group = usr.groups.find((g) => g.name === groupName);

      if (!group) throw new UserInputError("Group not found");

      group.tasks.push(newtask);

      await usr.save();
      return newtask;
    },
    async edittask(
      _,
      {
        groupId,
        taskId,
        checked,
        body,
        priority,
        remind,
        repeat,
        dueDate,
        dueTime,
      },
      context
    ) {
      const { email } = checkAuth(context);

      const usr = await User.findOne({ email });

      const group = usr.groups.find((group) => group.id === groupId);

      if (!group) throw new UserInputError("Group not found");

      const task = group.tasks.find((task) => task.id === taskId);

      if (!task) throw new UserInputError("task not found");

      task.checked = checked ? checked : task.checked;
      task.body = body ? body : task.body;
      task.priority = priority ? priority : task.priority;
      task.remind = remind ? remind : task.remind;
      task.repeat = repeat ? repeat : task.repeat;
      task.dueDate = dueDate ? dueDate : task.dueDate;
      task.dueTime = dueTime ? dueTime : task.dueTime;

      await usr.save();

      return task;
    },
  },
};
