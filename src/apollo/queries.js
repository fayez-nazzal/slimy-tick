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
  mutation addTask(
    $groupName: String!
    $body: String!
    $priority: Int!
    $dueDate: String
    $dueTime: String
  ) {
    addTask(
      groupName: $groupName
      body: $body
      priority: $priority
      dueDate: $dueDate
      dueTime: $dueTime
    ) {
      _id
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

export const EDIT_TASK = gql`
  mutation editTask(
    $taskId: ID! 
    $groupName: String!
    $body: String!
    $priority: Int!
    $dueDate: String
    $dueTime: String
  ) {
    editTask(
      taskId: $taskId
      groupName: $groupName
      body: $body
      priority: $priority
      dueDate: $dueDate
      dueTime: $dueTime
    ) {
      _id
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
      _id
      email
      created
      groups {
        _id
        name
        tasks {
          body
          priority
          dueDate
          dueTime
          repeat
        }
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      email
      created
      groups {
        _id
        name
        tasks {
          _id
          body
          priority
          dueDate
          dueTime
          repeat
        }
      }
    }
  }
`;

export const REFRESH_LOGIN_USER = gql`
  mutation refreshLogin {
    refreshLogin{
      email
      created
      groups {
        _id
        name
        tasks {
         _id
          body
          priority
          dueDate
          dueTime
          repeat
        }
      }
    }
  }
`;
