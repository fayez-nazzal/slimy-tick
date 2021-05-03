import { CREATE_task } from "../src/apollo/queries"
import { UserInputError } from "apollo-server-core"

const mocks = [
  {
    request: {
      query: CREATE_task,
      variables: {
        body: "sample task",
        groupName: "group 1",
        priority: 2,
        dueDate: "22-12-2029",
        dueTime: "2:00AM",
      },
    },
    result: {
      data: {
        createtask: {
          body: "sample task",
          groupName: "group 1",
          priority: 2,
          dueDate: "22-12-2029",
          dueTime: "2:00AM",
        },
      },
    },
  },
]

export default mocks
