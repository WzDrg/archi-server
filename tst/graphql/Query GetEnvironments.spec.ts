import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";

import { createApolloServer } from "../../src/graphql/GraphQLServer";
import { server_tst, server_acc, server_nosegment, server2_tst, cont_inst, cont_inst2 } from "./MockServices";
import { memoryEventStore } from "../../src/repository/MemoryEventStore";
import { appendCommands } from "../../src/repository/CommandAppender";
import { createServer } from "../../src/repository/server";

describe("environments query", () => {
   it("should return an empty list when no servers are defined", async () => {
      const eventStore = memoryEventStore();
      const client = createTestClient(createApolloServer(eventStore));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(0);
   });

   it("should return a simple environment", async () => {
      const event_store = appendCommands(memoryEventStore())([createServer("Server 1", "", "TST")])
      const client = createTestClient(createApolloServer(event_store));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("name", "TST");
   });

   it("should return an environment with empty name if server segment has not been defined", async () => {
      const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([server_nosegment])));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("name", "");
   });

   it("should return multiple environments", async () => {
      const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([server_tst, server_acc])));
      const response = await client.query({ query: gql`query {environments {name}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(2);
   });

   it("should return an environment with a server", async () => {
      const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([server_tst])));
      const response = await client.query({ query: gql`query {environments {name servers {name}}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("servers");
      expect(response.data.environments[0].servers).toHaveLength(1);
      expect(response.data.environments[0].servers[0]).toHaveProperty("name", "Server 1");
   });

   it("should return multiple servers in the same environment", async () => {
      const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([server_tst, server2_tst])));
      const response = await client.query({ query: gql`query {environments {name servers {name}}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0]).toHaveProperty("servers");
      expect(response.data.environments[0].servers).toHaveLength(2);
      expect(response.data.environments[0].servers[0]).toHaveProperty("name", "Server 1");
      expect(response.data.environments[0].servers[1]).toHaveProperty("name", "sv4");
   });

   it("should return a single server with no container instance", async () => {
      const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([server_tst])));
      const response = await client.query({ query: gql`query {environments {name servers {name containers {name}}}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0].servers).toHaveLength(1);
      expect(response.data.environments[0].servers[0].containers).toHaveLength(0);
   });

   it("should return a single server with a singe container instance", async () => {
      const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([server_tst, cont_inst])));
      const response = await client.query({ query: gql`query {environments {name servers {name containers {name}}}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0].servers).toHaveLength(1);
      expect(response.data.environments[0].servers[0].containers).toHaveLength(1);
      expect(response.data.environments[0].servers[0].containers[0]).toHaveProperty("name", "ci1");
   });

   it("should return a single server with two container instances", async () => {
      const client = createTestClient(createApolloServer(appendCommands(memoryEventStore())([server_tst, cont_inst, cont_inst2])));
      const response = await client.query({ query: gql`query {environments {name servers {name containers {name}}}}` });
      expect(response.errors).toBeUndefined();
      expect(response.data.environments).toHaveLength(1);
      expect(response.data.environments[0].servers).toHaveLength(1);
      expect(response.data.environments[0].servers[0].containers).toHaveLength(2);
   });

});