import { gql } from '@apollo/client';

export const QUERY_USER_INFO = gql`
  query getUserInfo {
    userInfo {
      email
      created
      groups {
        name
        created
        tasks {
          body
          created
        }
      }
    }
  }
`;

export const QUERY_TASKS_IN_GROUP = gql`
  query {
    tasks(groupName: "group 1") {
      body
    }
  }
`;

export const CREATE_TASK = gql`
  mutation createtask(
    $groupName: String!
    $body: String!
    $priority: Int!
    $dueDate: String
    $dueTime: String
  ) {
    createtask(
      groupName: $groupName
      body: $body
      priority: $priority
      dueDate: $dueDate
      dueTime: $dueTime
    ) {
      id
      checked
      body
      priority
      remind
      repeat
      dueDate
      dueTime
      created
    }
  }
`;

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
      id
      email
      token
      created
      groups {
        id
        name
        tasks {
          body
          priority
        }
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      token
      created
      groups {
        id
        name
        tasks {
          id
          body
          priority
        }
      }
    }
  }
`;
