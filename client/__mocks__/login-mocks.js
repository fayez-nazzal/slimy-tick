import { LOGIN_USER } from "../src/apollo/queries"
import { UserInputError } from "apollo-server-core"
const mocks = [
  {
    request: {
      query: LOGIN_USER,
      variables: {
        email: "",
        password: "",
      },
    },
    result: {
      errors: [
        new UserInputError("Error", {
          errors: {
            email: "Email must not be empty",
            password: "Password must not be empty",
          },
        }),
      ],
    },
  },
  {
    request: {
      query: LOGIN_USER,
      variables: {
        email: "wrong@email..com",
        password: "",
      },
    },
    result: {
      errors: [
        new UserInputError("Error", {
          errors: {
            email: "Email not valid",
          },
        }),
      ],
    },
  },
  {
    request: {
      query: LOGIN_USER,
      variables: {
        email: "correct@email.com",
        password: "valid password",
      },
    },
    result: {
      data: {
        login: {
          token: "fake token",
          email: "correct@email.com",
          groups: [
            {
              name: "group 1",
              todos: [],
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: LOGIN_USER,
      variables: {
        email: "correct@email.com",
        password: "incorrect password",
      },
    },
    result: {
      errors: [
        new UserInputError("Wrong credentials", {
          errors: {
            general: "Wrong credentials",
          },
        }),
      ],
    },
  },
]

export default mocks
