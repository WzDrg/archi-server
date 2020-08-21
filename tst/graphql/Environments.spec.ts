import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createApolloServer } from "../../src/graphql/GraphQLServer";
import { createMockServices, server_tst, server_acc, server_nosegment, server2_tst } from "./MockServices";

describe("environments query", () => {
   it("should return an empty list when no servers are defined", async () => {
      const client = createTestClient(createApolloServer(createMockServices([])));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(0);
   });

   it("should return a simple environment", async () => {
      const client = createTestClient(createApolloServer(createMockServices([server_tst])));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("name", server_tst.segment);
   });

   it("should return an environment with empty name if server segment has not been defined", async () => {
      const client = createTestClient(createApolloServer(createMockServices([server_nosegment])));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("name", "");
   });

   it("should return multiple environments", async () => {
      const client = createTestClient(createApolloServer(createMockServices([server_tst, server_acc])));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(2);
   });

   it("should return an environment with a server", async () => {
      const client = createTestClient(createApolloServer(createMockServices([server_tst])));
      const response = await client.query({ query: gql`query {environments {name servers {name}}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("servers");
      expect(response.data.environments[0].servers).toHaveLength(1);
      expect(response.data.environments[0].servers[0]).toHaveProperty("name", server_tst.name);
   });

   it("should return multiple servers in the same environment", async () => {
      const client = createTestClient(createApolloServer(createMockServices([server_tst, server2_tst])));
      const response = await client.query({ query: gql`query {environments {name servers {name}}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("servers");
      expect(response.data.environments[0].servers).toHaveLength(2);
      expect(response.data.environments[0].servers[0]).toHaveProperty("name", server_tst.name);
      expect(response.data.environments[0].servers[1]).toHaveProperty("name", server2_tst.name);
   });
});