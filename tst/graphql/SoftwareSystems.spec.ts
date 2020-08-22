import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createApolloServer } from "../../src/graphql/GraphQLServer";
import { createMockServices, ss_docgen, ss_doccapt, cont_docgen, cont_docgen2, con1 } from "./MockServices";

describe("softwareSystems query", () => {
    it("should return an empty list when no servers are defined", async () => {
        const client = createTestClient(createApolloServer(createMockServices([])));
        const response = await client.query({ query: gql`query {softwareSystems {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(0);
    });

    it("should return a single software system", async () => {
        const client = createTestClient(createApolloServer(createMockServices([ss_docgen])));
        const response = await client.query({ query: gql`query {softwareSystems {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems[0]).toHaveProperty("name", ss_docgen.name);
    });

    it("should return multiple software systems", async () => {
        const client = createTestClient(createApolloServer(createMockServices([ss_docgen, ss_doccapt])));
        const response = await client.query({ query: gql`query {softwareSystems {name}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(2);
    });

    it("should return a software system with a single container", async () => {
        const client = createTestClient(createApolloServer(createMockServices([ss_docgen, cont_docgen])));
        const response = await client.query({ query: gql`query {softwareSystems {name, containers {name}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems.containers).toHaveLength(1);
    });

    it("should return a software system with multiple containers", async () => {
        const client = createTestClient(createApolloServer(createMockServices([ss_docgen, cont_docgen, cont_docgen2])));
        const response = await client.query({ query: gql`query {softwareSystems {name, containers {name}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(1);
        expect(response.data.softwareSystems.containers).toHaveLength(2);
    });

    it("should return a software system that uses another software system", async () => {
        const client = createTestClient(createApolloServer(createMockServices([ss_docgen, ss_doccapt, con1])));
        const response = await client.query({ query: gql`query {softwareSystems {name, uses {name type}}}` });
        expect(response.errors).toBeUndefined();
        expect(response.data.softwareSystems).toHaveLength(2);
        expect(response.data.softwareSystems[0].uses).toHaveLength(1);
    });

});