const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGODB } = require("./config.js");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: true,
    credentails: true,
  },
  context: ({ req }) => ({ req }),
});

mongoose
  .connect(MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB is connected ...");
    return server.listen({
      port: 5000,
    });
  })
  .then((res) => {
    console.log("Server running at ", res.url);
  });
