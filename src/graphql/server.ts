import express from "express";
import { ApolloServer } from "apollo-server-express";
import { Services } from "../core/service";
import typeDefs from "./TypeDefs";
import cors from "cors";
import { getSoftwareSystems, getSoftwareSystemUses } from "./types/SoftwareSystem";
import { getContainersOfSoftwareSystem, getContainerUses } from "./types/Container";

export interface ServerConfiguration {
  playground: boolean;
  introspection: boolean;
}

export const startServer = async (config: ServerConfiguration, services: Services) => {
  const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
      Query: {
        softwareSystems: (_, __, { services }) => getSoftwareSystems(services)(),
      },
      SoftwareSystem: {
        containers: (parent, _, { services }) => getContainersOfSoftwareSystem(services)(parent.name),
        uses: (parent, _, { services }) => getSoftwareSystemUses(services)(parent.name)
      },
      Container: {
        uses: (parent, _, { services }) => getContainerUses(services)(parent.name)
      }
    },
    context: { services: services }
  });
  const app = express();
  app.use(cors());
  server.applyMiddleware({ app: app, path: "/graphql", cors: false });
  app.listen({ port: 4000 }, () => { console.log(`Server listening`) });
}

