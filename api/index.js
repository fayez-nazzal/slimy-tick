const express = require('express')
const cors = require('cors')
var cookieParser = require('cookie-parser')
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const { MONGODB } = require('./config.js');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res }),
    playground: {
      settings: {
        "request.credentials": "include"
      }
    }  
  });
  
  mongoose
  .connect(MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB is connected ...');
    return server.start();
  })
  .then(() => {
    const app = express();
    app.use(cors({
      credentials: true, origin: 'http://localhost:8000'
    }))
    app.use(cookieParser())
    server.applyMiddleware({app, cors: false})
    return app.listen({
      port: 5000,
    });
  })
  .then(() => {
    console.log(`Server running at localhost:5000${server.graphqlPath}`);
  });
  