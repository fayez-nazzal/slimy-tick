const { gql } = require("apollo-server");

module.exports = gql`
  type Todo {
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
    todos: [Todo]!
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
    todos(groupName: String!): [Todo]!
    group(id: ID!): Group!
  }

  type Mutation {
    createTodo(
      groupName: String!
      body: String!
      priority: Int!
      remind: String
      repeat: String
      dueDate: String
      dueTime: String
    ): Todo!
    createGroup(name: String!): Group!
    editTodo(
      groupId: String!
      todoId: String!
      checked: Boolean
      body: String
      priority: Int
      remind: String
      repeat: [String]
      dueDate: String
      dueTime: String
    ): Todo!
    register(email: String!, password: String!, confirmPassword: String!): User!
    login(email: String!, password: String!): User!
  }
`;
