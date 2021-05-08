const { gql } = require('apollo-server');

module.exports = gql`
  type Task {
    id: String!
    body: String!
    checked: Boolean!
    created: String!
    remind: String
    repeat: String
    priority: String!
    dueDate: String
    dueTime: String
  }

  type Group {
    id: String!
    name: String!
    tasks: [Task]!
    created: String!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    token: String!
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
    edittask(
      groupId: String!
      taskId: String!
      checked: Boolean
      body: String
      priority: Int
      remind: String
      repeat: [String]
      dueDate: String
      dueTime: String
    ): Task!
    register(email: String!, password: String!, confirmPassword: String!): User!
    login(email: String!, password: String!): User!
  }
`;
