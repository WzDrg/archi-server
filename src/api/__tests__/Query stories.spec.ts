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

describe("stories query", () => {
    it("should return an empty list when no servers are defined", async () => {
        serverConfig.storyServices.getAllStories.mockReturnValue(right([]));
        const client = createTestClient(createApolloServer(serverConfig));
        const response = await client.query({ query: gql`query {stories {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.stories).toHaveLength(0);
    });
});
