import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createApolloServer } from "../../src/graphql/GraphQLServer";
import { ss_docgen, ss_doccapt, container1, container2, con1, container3, con2, con3 } from "./MockServices";
import { appendCommands } from "../../src/repository/CommandAppender";
import { memoryEventStore } from "../../src/repository/MemoryEventStore";

describe("softwareSystems query", () => {
    it("should return an empty list when no servers are defined", async () => {
        const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([])));
        const response = await client.query({ query: gql`query {softwareSystems {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(0);
    });

    it("should return a single software system", async () => {
        const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([ss_docgen])));
        const response = await client.query({ query: gql`query {softwareSystems {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems[0]).toHaveProperty("name", "Document Generation");
    });

    it("should return multiple software systems", async () => {
        const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([ss_docgen, ss_doccapt])));
        const response = await client.query({ query: gql`query {softwareSystems {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(2);
    });

    it("should return a software system with a single container", async () => {
        const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([ss_docgen, container1])));
        const response = await client.query({ query: gql`query {softwareSystems {name, containers {name}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems[0].containers).toHaveLength(1);
    });

    it("should return a software system with multiple containers", async () => {
        const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([ss_docgen, container1, container2])));
        const response = await client.query({ query: gql`query {softwareSystems {name, containers {name}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems[0].containers).toHaveLength(2);
    });

    it("should return a software system that uses another software system", async () => {
        const event_store = appendCommands(memoryEventStore())([ss_docgen, ss_doccapt, con1]);
        const client = createTestClient(createApolloServer(event_store));
        const response = await client.query({ query: gql`query {softwareSystems {name, uses {name type}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(2);
        const document_generation = response.data.softwareSystems.filter(ss => ss.name === "Document Generation")[0];
        expect(document_generation.uses).toHaveLength(1);
        expect(document_generation.uses[0]).toHaveProperty("type", "SOFTWARESYSTEM");
        expect(document_generation.uses[0]).toHaveProperty("name", ss_doccapt.id.id);
    });

    it("should return a software system that uses a container", async () => {
        const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([ss_docgen, ss_doccapt, container3, con2])));
        const response = await client.query({ query: gql`query {softwareSystems {name, uses {name type}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(2);
        const document_generation = response.data.softwareSystems.filter(ss => ss.name === "Document Generation")[0];
        expect(document_generation.uses).toHaveLength(1);
        expect(document_generation.uses[0]).toHaveProperty("type", "CONTAINER");
        expect(document_generation.uses[0]).toHaveProperty("name", container3.id.id);
    });

    it("should return a container that uses a software system", async () => {
        const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([ss_docgen, container1, ss_doccapt, con3])));
        const response = await client.query({ query: gql`query {softwareSystems {name containers {name uses {name type}}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(2);
        const document_generation = response.data.softwareSystems.filter(ss => ss.name === "Document Generation")[0];
        expect(document_generation.containers).toHaveLength(1);
        expect(document_generation.containers[0].uses).toHaveLength(1);
        expect(document_generation.containers[0].uses[0]).toHaveProperty("type", "SOFTWARESYSTEM");
        expect(document_generation.containers[0].uses[0]).toHaveProperty("name", ss_doccapt.id.id);
    });

});