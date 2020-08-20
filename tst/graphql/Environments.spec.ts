import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createApolloServer } from "../../src/graphql/GraphQLServer";
import { createMockServices, sv1, sv2, sv3 } from "./MockServices";

describe("GraphQL API", () => {
   it("should return a simple environment", async () => {
      const client = createTestClient(createApolloServer(createMockServices([sv1])));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("name", sv1.segment);
   });

   it("should return an environment with empty name if server segment has not been defined", async () => {
      const client = createTestClient(createApolloServer(createMockServices([sv3])));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("name", "");
   });

   it("should return multiple environments", async () => {
      const client = createTestClient(createApolloServer(createMockServices([sv1, sv2])));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(2);
   });

   it("should return an environment with a server", async () => {
      const client = createTestClient(createApolloServer(createMockServices([sv1])));
      const response = await client.query({ query: gql`query {environments {name servers {name}}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("servers");
      expect(response.data.environments[0].servers).toHaveLength(1);
      expect(response.data.environments[0].servers[0]).toHaveProperty("name", sv1.name);
   });
});