import express from "express";
import { ApolloServer } from "apollo-server-express";
import { Repository } from "../repository/service";
import typeDefs from "./TypeDefs";
import cors from "cors";
import { getSoftwareSystems, getSoftwareSystemUses } from "./types/SoftwareSystem";
import { getContainersOfSoftwareSystem, getUsesOfContainer, getContainerOfContainerInstance } from "./types/GQLContainer";
import { getEnvironments } from "./types/GQLEnvironment";
import { serversOfEnvironment } from "./types/GQLServer";
import { getContainerInstancesOfServer } from "./types/GQLContainerInstance";
import { serverId } from "../repository/aggregates/server";
import { containerInstanceId } from "../repository/aggregates/container_instance";
import { softwareSystemId } from "../repository/aggregates/software_system";
import { containerId } from "../repository/aggregates/container";

export interface ServerConfiguration {
  playground: boolean;
  introspection: boolean;
}

export const createApolloServer = (services: Repository) => {
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
        uses: (parent, _, { services }) => getUsesOfContainer(services)(containerId(parent.id))
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

export const startServer = async (services: Repository) => {
  const app = express();
  app.use(cors());
  createApolloServer(services).applyMiddleware({ app: app, path: "/graphql", cors: false });
  app.listen({ port: 4000 }, () => { console.log(`Server listening`) });
}

