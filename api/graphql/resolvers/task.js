/* eslint-disable comma-dangle */
/* eslint-disable no-underscore-dangle */
const { UserInputError } = require('apollo-server-errors');
const User = require('../../models/user');
const checkAuth = require('../../utils/checkAuth');

module.exports = {
  Query: {
  },

  Mutation: {
    // eslint-disable-next-line object-curly-newline
    async addTask(
      _,
      // eslint-disable-next-line object-curly-newline
      { groupName, body, priority, remind, repeat, dueDate, dueTime },
      {req}
    ) {
      const token = req.cookies['slimytick-jwt'];

      const { email } = checkAuth(token);

      if (!body) {
        throw new UserInputError('task body must not be empty');
      }
      // no error thrown -> user authenticated
      const newtask = {
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

      if (!group) throw new UserInputError('Group not found');

      group.tasks.push(newtask);

      await usr.save();
      return newtask;
    },
    async editTask(
      _,
      {
        taskId,
        groupName,
        checked,
        body,
        priority,
        remind,
        repeat,
        dueDate,
        dueTime,
      },
      {req}
    ) {
      const token = req.cookies['slimytick-jwt'];

      const { email } = checkAuth(token);

      const usr = await User.findOne({ email });

      const group = usr.groups.find((group) => group.name === groupName);
      console.log(group.tasks)
      console.log(taskId)
      if (!group) throw new UserInputError('Group not found');

      const task = group.tasks.find((task) => task._id.toString() === taskId.toString());

      if (!task) throw new UserInputError('task not found');

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
