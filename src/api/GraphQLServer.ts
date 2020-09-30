import express from "express";
import { ApolloServer, ApolloError } from "apollo-server-express";
import { getOrElse } from "fp-ts/lib/Either";
import cors from "cors";

import typeDefs from "./TypeDefs";
import { getSoftwareSystems, getSoftwareSystemUses } from "./query/SoftwareSystemQuery";
import { getContainersOfSoftwareSystem, getUsesOfContainer, getContainerOfContainerInstance } from "./query/ContainerQuery";
import { getEnvironments } from "./query/EnvironmentQuery";
import { serversOfEnvironment } from "./query/ServerQuery";
import { getContainerInstancesOfServer } from "./query/ContainerInstanceQuery";
import { serverId } from "../core/model/Server";
import { queryAllStories } from "./query/StoryQuery";
import { containerId, containerInstanceId, softwareSystemId, AggregateServices, StoryServices } from "../core/index";
import { Fault } from "../core/Fault";

export interface ServerConfiguration {
    playground: boolean;
    introspection: boolean;
    storyServices: StoryServices
    aggregateServices: AggregateServices;
}

const handleFault = getOrElse<Fault, any>((fault: Fault) => { return new ApolloError("Default message"); });

export const createApolloServer = (config: ServerConfiguration) => {
    return new ApolloServer({
        typeDefs: typeDefs,
        resolvers: {
            Query: {
                softwareSystems: (_, __, ctx) => handleFault(getSoftwareSystems(ctx.getAggregatesOfType)()),
                environments: (_, __, ctx) => handleFault(getEnvironments(ctx.getAggregatesOfType)()),
                stories: (_, __, ctx) => handleFault(queryAllStories(ctx.getAllStories)())
            },
            SoftwareSystem: {
                containers: (parent, _, ctx) => handleFault(getContainersOfSoftwareSystem(ctx.getAggregatesOfType)(softwareSystemId(parent.id))),
                uses: (parent, _, ctx) => handleFault(getSoftwareSystemUses(ctx.getAggregatesOfType)(parent.id))
            },
            Container: {
                uses: (parent, _, ctx) => handleFault(getUsesOfContainer(ctx.getAggregatesOfType)(containerId(parent.id)))
            },
            Environment: {
                servers: (parent, _, ctx) => handleFault(serversOfEnvironment(ctx.getAggregatesOfType)(parent.name))
            },
            Server: {
                containers: (parent, _, ctx) => handleFault(getContainerInstancesOfServer(ctx.getAggregatesOfType)(serverId(parent.id)))
            },
            ContainerInstance: {
                container: (parent, _, ctx) => handleFault(getContainerOfContainerInstance(ctx.getAggregateWithId)(containerInstanceId(parent.id)))
            }
        },
        context: {
            getAggregatesOfType: config.aggregateServices.getAggregatesOfType,
            getAggregateWithId: config.aggregateServices.getAggregateWithId,
            getAllStories: config.storyServices.getAllStories
        }
    });
}

export const startServer = async (config: ServerConfiguration) => {
    const app = express();
    app.use(cors());
    createApolloServer(config).applyMiddleware({ app: app, path: "/graphql", cors: false });
    app.listen({ port: 4000 }, () => { console.log(`Server listening`) });
}

