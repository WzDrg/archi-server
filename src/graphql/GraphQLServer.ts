import express from "express";
import { ApolloServer } from "apollo-server-express";
import { Services } from "../core/service";
import typeDefs from "./TypeDefs";
import cors from "cors";
import { getSoftwareSystems, getSoftwareSystemUses } from "./types/SoftwareSystem";
import { getContainersOfSoftwareSystem, getUsesOfContainer, getContainerOfContainerInstance } from "./types/GQLContainer";
import { getEnvironments } from "./types/GQLEnvironment";
import { serversOfEnvironment } from "./types/GQLServer";
import { getContainerInstancesOfServer } from "./types/GQLContainerInstance";
import { serverId } from "../core/aggregates/server";
import { containerInstanceId } from "../core/aggregates/container_instance";
import { softwareSystemId } from "../core/aggregates/software_system";

export interface ServerConfiguration {
  playground: boolean;
  introspection: boolean;
}

export const createApolloServer = (services: Services) => {
  return new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
      Query: {
        softwareSystems: (_, __, { services }) => getSoftwareSystems(services)(),
        environments: (_, __, { services }) => getEnvironments(services)()
      },
      SoftwareSystem: {
        containers: (parent, _, { services }) => getContainersOfSoftwareSystem(services)(softwareSystemId(parent.id)),
        uses: (parent, _, { services }) => getSoftwareSystemUses(services)(parent.id)
      },
      Container: {
        uses: (parent, _, { services }) => getUsesOfContainer(services)(parent.name)
      },
      Environment: {
        servers: (parent, _, { services }) => serversOfEnvironment(services)(parent.name)
      },
      Server: {
        containers: (parent, _, { services }) => getContainerInstancesOfServer(services)(serverId(parent.id))
      },
      ContainerInstance: {
        container: (parent, _, { services }) => getContainerOfContainerInstance(services)(containerInstanceId(parent.id))
      }
    },
    context: { services: services }
  });
}

export const startServer = async (services: Services) => {
  const app = express();
  app.use(cors());
  createApolloServer(services).applyMiddleware({ app: app, path: "/graphql", cors: false });
  app.listen({ port: 4000 }, () => { console.log(`Server listening`) });
}

