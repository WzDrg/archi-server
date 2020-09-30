import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createApolloServer } from "../GraphQLServer";
import { right } from "fp-ts/lib/Either";

const serverConfig = {
    playground: false,
    introspection: false,
    aggregateServices: {
        getAggregatesOfType: jest.fn(),
        getAggregateWithId: jest.fn()
    },
    storyServices: {
        addStory: jest.fn(),
        getAllStories: jest.fn()
    }
}

describe("environments query", () => {
    it("should return an empty list when no servers are defined", async () => {
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValue(right([]));
        const client = createTestClient(createApolloServer(serverConfig));
        const response = await client.query({ query: gql`query {environments {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.environments).toHaveLength(0);
    });
});
