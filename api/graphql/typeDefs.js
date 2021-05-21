const { gql } = require('apollo-server-express');

module.exports = gql`
  type Task {
    _id: ID!
    body: String!
    checked: Boolean!
    created: String!
    remind: String
    repeat: String
    priority: Int!
    dueDate: String
    dueTime: String
  }

  type Group {
    _id: ID!
    name: String!
    tasks: [Task]!
    created: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String!
    created: String!
    groups: [Group]!
  }

  type Query {
    userInfo: User!
    tasks(groupName: String!): [Task]!
    group(id: ID!): Group!
  }

  type Mutation {
    addTask(
      groupName: String!
      body: String!
      priority: Int!
      remind: String
      repeat: String
      dueDate: String
      dueTime: String
    ): Task!
    createGroup(name: String!): Group!
    editTask(
      taskId: ID!
      groupName: String!
      checked: Boolean
      body: String
      priority: Int
      remind: String
      repeat: String
      dueDate: String
      dueTime: String
    ): Task!
    removeTask(
      taskId: ID!
      groupName: String
    ): Boolean!
    register(email: String!, password: String!, confirmPassword: String!): User!
    login(email: String!, password: String!): User!
    refreshLogin: User!
  }
`;
