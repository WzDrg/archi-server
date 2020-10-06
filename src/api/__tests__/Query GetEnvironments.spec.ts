import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createApolloServer } from "../GraphQLServer";
import { right } from "fp-ts/lib/Either";

const getAggregatesOfType = jest.fn();
const getAggregateWithId = jest.fn();
const serverConfig = {
    playground: false,
    introspection: false,
    aggregateServices: {
        getAggregatesOfType: selection=>getAggregatesOfType,
        getAggregateWithId: selection=>getAggregateWithId
    },
    storyServices: {
        addStory: jest.fn(),
        getAllStories: jest.fn()
    }
}

describe("environments query", () => {
    it("should return an empty list when no servers are defined", async () => {
        getAggregatesOfType.mockReturnValue(right([]));
        const client = createTestClient(createApolloServer(serverConfig));
        const response = await client.query({ query: gql`query {environments {name}}` , variables: {until: new Date() }});
        expect(response.errors).toBeUndefined();
        expect(response.data.environments).toHaveLength(0);
    });
});
