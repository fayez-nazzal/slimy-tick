import { gql } from "@apollo/client"

export const QUERY_USER_INFO = gql`
  query getUserInfo {
    userInfo {
      email
      created
      groups {
        name
        created
        todos {
          body
          created
        }
      }
    }
  }
`

export const QUERY_TODOS_IN_GROUP = gql`
  query {
    todos(groupName: "group 1") {
      body
    }
  }
`

export const CREATE_TODO = gql`
  mutation createTodo($groupName: String!, $body: String!, $priority: Int!) {
    createTodo(groupName: $groupName, body: $body, priority: $priority) {
      checked
      body
      priority
      remind
      repeat
      due
      created
    }
  }
`

export const REGISTER_USER = gql`
  mutation register(
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      email
      token
      created
      groups {
        name
        todos {
          body
          priority
        }
      }
    }
  }
`

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      token
      created
      groups {
        name
        todos {
          body
          priority
        }
      }
    }
  }
`
