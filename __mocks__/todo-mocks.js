import { UserInputError } from 'apollo-server-core';
import { CREATE_task } from '../src/apollo/queries';

const mocks = [
  {
    request: {
      query: CREATE_task,
      variables: {
        body: 'sample task',
        groupName: 'group 1',
        priority: 2,
        dueDate: '22-12-2029',
        dueTime: '2:00AM',
      },
    },
    result: {
      data: {
        addTask: {
          body: 'sample task',
          groupName: 'group 1',
          priority: 2,
          dueDate: '22-12-2029',
          dueTime: '2:00AM',
        },
      },
    },
  },
];

export default mocks;
