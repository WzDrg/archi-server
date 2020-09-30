import { createTestClient } from "apollo-server-testing";
import { ServerConfiguration, createApolloServer } from "../GraphQLServer";

const serverConfig: ServerConfiguration = {
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

describe("Add Story", () => {
    it("should add a new story", () => {
        const client = createTestClient(createApolloServer(serverConfig));
    });
});
