import express from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./TypeDefs";
import cors from "cors";
import { getSoftwareSystems, getSoftwareSystemUses } from "./SoftwareSystem";
import { getContainersOfSoftwareSystem, getUsesOfContainer, getContainerOfContainerInstance } from "./GQLContainer";
import { getEnvironments } from "./GQLEnvironment";
import { serversOfEnvironment } from "./GQLServer";
import { getContainerInstancesOfServer } from "./GQLContainerInstance";
import { serverId } from "../repository/server";
import { containerInstanceId } from "../repository/container_instance";
import { softwareSystemId } from "../repository/software_system";
import { containerId } from "../repository/container";
import { EventStore } from "../repository/EventStore";

export interface ServerConfiguration {
  playground: boolean;
  introspection: boolean;
}

export const createApolloServer = (event_store: EventStore) => {
  return new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
      Query: {
        softwareSystems: (_, __, { event_store }) => getSoftwareSystems(event_store)(),
        environments: (_, __, { event_store }) => getEnvironments(event_store)()
      },
      SoftwareSystem: {
        containers: (parent, _, { event_store }) => getContainersOfSoftwareSystem(event_store)(softwareSystemId(parent.id)),
        uses: (parent, _, { event_store }) => getSoftwareSystemUses(event_store)(parent.id)
      },
      Container: {
        uses: (parent, _, { event_store }) => getUsesOfContainer(event_store)(containerId(parent.id))
      },
      Environment: {
        servers: (parent, _, { event_store }) => serversOfEnvironment(event_store)(parent.name)
      },
      Server: {
        containers: (parent, _, { event_store }) => getContainerInstancesOfServer(event_store)(serverId(parent.id))
      },
      ContainerInstance: {
        container: (parent, _, { event_store }) => getContainerOfContainerInstance(event_store)(containerInstanceId(parent.id))
      }
    },
    context: { event_store: event_store }
  });
}

export const startServer = async (event_store: EventStore) => {
  const app = express();
  app.use(cors());
  createApolloServer(event_store).applyMiddleware({ app: app, path: "/graphql", cors: false });
  app.listen({ port: 4000 }, () => { console.log(`Server listening`) });
}

