const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type User {
        id: ID!
        username: String!
        email: String!
        language: String
        gradeLevels: [String]
        references: [String]
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    type Query {
        getUser(id: ID!): User
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): AuthPayload
        login(username: String!, password: String!): AuthPayload
        updateUser(id: ID!, language: String, gradeLevels: [String], references: [String]): User
    }
`);

module.exports = schema; 