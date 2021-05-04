import { LOGIN_USER, REGISTER_USER } from "../src/apollo/queries"
import { UserInputError } from "apollo-server-core"

const mocks = [
  {
    request: {
      query: REGISTER_USER,
      variables: {
        email: "",
        password: "",
        confirmPassword: "",
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
      query: REGISTER_USER,
      variables: {
        email: "wrong@email..com",
        password: "",
        confirmPassword: "",
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
      query: REGISTER_USER,
      variables: {
        email: "correct@email.com",
        password: "valid password",
        confirmPassword: "valid.password",
      },
    },
    result: {
      errors: [
        new UserInputError("Error", {
          errors: {
            confirmPassword: "Passwords must match",
          },
        }),
      ],
    },
  },
  {
    request: {
      query: REGISTER_USER,
      variables: {
        email: "correct@email.com",
        password: "valid password",
        confirmPassword: "valid password",
      },
    },
    result: {
      data: {
        register: {
          token: "fake token",
          email: "correct@email.com",
        },
      },
    },
  },
  {
    request: {
      query: REGISTER_USER,
      variables: {
        email: "correct@email.com",
        password: "123",
        confirmPassword: "123",
      },
    },
    result: {
      errors: [
        new UserInputError("Wrong credentials", {
          errors: {
            password: "Pasword must have 6 or more characters",
          },
        }),
      ],
    },
  },
]

export default mocks
