import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createApolloServer } from "../GraphQLServer";
import { right } from "fp-ts/lib/Either";
import { SoftwareSystem, softwareSystemId, Container, containerId } from "../../core";

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

describe("softwareSystems query", () => {
    it("should return an empty list when no software systems are defined", async () => {
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValueOnce(right([]));
        const client = createTestClient(createApolloServer(serverConfig));
        const response = await client.query({ query: gql`query {softwareSystems {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(0);
    });

    it("should return a single software system", async () => {
        const softwareSystem: SoftwareSystem = {
            id: softwareSystemId("ss"),
            name: "Document Generation",
            description: "Document Generation"
        };
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValueOnce(right([softwareSystem]));
        const client = createTestClient(createApolloServer(serverConfig));
        const response = await client.query({ query: gql`query {softwareSystems {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems[0]).toHaveProperty("name", softwareSystem.name);
    });

    it("should return multiple software systems", async () => {
        const softwareSystem: SoftwareSystem = {
            id: softwareSystemId("ss1"),
            name: "Document Generation",
            description: "Document Generation"
        };
        const softwareSystem2: SoftwareSystem = {
            id: softwareSystemId("ss2"),
            name: "Document Generation2",
            description: "Document Generation2"
        };
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValueOnce(right([softwareSystem, softwareSystem2]));
        const client = createTestClient(createApolloServer(serverConfig));
        const response = await client.query({ query: gql`query {softwareSystems {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(2);
    });

    it("should return a software system without containers", async () => {
        const softwareSystem: SoftwareSystem = {
            id: softwareSystemId("ss1"),
            name: "Document Generation",
            description: "Document Generation"
        };
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValueOnce(right([softwareSystem]));
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValueOnce(right([]));
        const client = createTestClient(createApolloServer(serverConfig));
        const response = await client.query({ query: gql`query {softwareSystems {name containers {name}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems[0]).toHaveProperty("containers");
        expect(response.data.softwareSystems[0].containers).toHaveLength(0);
    });

    it("should return a software system with a single container", async () => {
        const softwareSystem: SoftwareSystem = {
            id: softwareSystemId("ss1"),
            name: "Document Generation",
            description: "Document Generation"
        };
        const container: Container = {
            id: containerId("con1"),
            name: "Container",
            description: "Container",
            software_system: softwareSystem.id
        }
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValueOnce(right([softwareSystem]));
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValueOnce(right([container]));
        const client = createTestClient(createApolloServer(serverConfig));
        const response = await client.query({ query: gql`query {softwareSystems {name containers {name}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems[0]).toHaveProperty("containers");
        expect(response.data.softwareSystems[0].containers).toHaveLength(1);
        expect(response.data.softwareSystems[0].containers[0]).toHaveProperty("name", container.name);
    });

    it("should return a software system with multiple containers", async () => {
        const softwareSystem: SoftwareSystem = {
            id: softwareSystemId("ss1"),
            name: "Document Generation",
            description: "Document Generation"
        };
        const container: Container = {
            id: containerId("con1"),
            name: "Container",
            description: "Container",
            software_system: softwareSystem.id
        }
        const container2: Container = {
            id: containerId("con2"),
            name: "Container2",
            description: "Container2",
            software_system: softwareSystem.id
        }
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValueOnce(right([softwareSystem]));
        serverConfig.aggregateServices.getAggregatesOfType.mockReturnValueOnce(right([container, container2]));
        const client = createTestClient(createApolloServer(serverConfig));
        const response = await client.query({ query: gql`query {softwareSystems {name containers {name}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems[0]).toHaveProperty("containers");
        expect(response.data.softwareSystems[0].containers).toHaveLength(2);
    });

});
