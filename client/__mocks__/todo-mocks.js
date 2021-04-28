import { CREATE_TODO } from "../src/apollo/queries"
import { UserInputError } from "apollo-server-core"

const mocks = [
  {
    request: {
      query: CREATE_TODO,
      variables: {
        body: "sample todo",
        groupName: "group 1",
        priority: 2,
        dueDate: "22-12-2029",
        dueTime: "2:00AM",
        dueISO: "",
      },
    },
    result: {
      data: {
        createTodo: {
          body: "sample todo",
          groupName: "group 1",
          priority: 2,
          dueDate: "22-12-2029",
          dueTime: "2:00AM",
          dueISO: "",
        },
      },
    },
  },
]

export default mocks
