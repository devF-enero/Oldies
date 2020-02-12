const mongoose = require('mongoose');
const { ApolloServer, gql } = require ('apollo-server');
const { importSchema } = require('graphql-import');
const resolvers = require('./resolvers');
const verifyToken = require('./utils/verifyToken');
const AuthDirective = require('./resolvers/Directives/AuthDirective');
const { makeExecutableSchema } = require('graphql-tools')

const typeDefs = importSchema(__dirname + '/schema.graphql');
//const typeDefs = importSchema('./server/schema.graphql');

const MONGO_URI= 'mongodb+srv://user1:RjOpupDHlf8xw6oe@cluster0-gknq4.gcp.mongodb.net/meetupclone?retryWrites=true&w=majority'

mongoose.connect(MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true});

const mongo = mongoose.connection;

mongo.on('error', (error) => console.log(error)).once('open',()=>console.log('Connected to database'));

const schema = makeExecutableSchema({
    typeDefs, 
    resolvers,
    schemaDirectives:{
        auth:AuthDirective // pasando la directiva a Apollo para que se pueda usar en el schema.graphql (auth is the label we have given it)
    },
});

const server = new ApolloServer({
    schema,
    context: async ({req}) => await verifyToken(req) // this will return the token of the user making the request, and adding it as a "context" to the query
})


const port = process.env.PORT || 4000;


server.listen({port}).then(({ url }) => {
	console.log(`Server starts in : ${url}`);
});