import express from "express";
import { ApolloServer, ApolloError } from "apollo-server-express";
import { getOrElse } from "fp-ts/lib/Either";
import cors from "cors";
import { GraphQLDateTime } from "graphql-iso-date";

import typeDefs from "./TypeDefs";
import { getSoftwareSystems, getSoftwareSystemUses } from "./query/SoftwareSystemQuery";
import { getContainersOfSoftwareSystem, getUsesOfContainer, getContainerOfContainerInstance } from "./query/ContainerQuery";
import { getEnvironments } from "./query/EnvironmentQuery";
import { serversOfEnvironment } from "./query/ServerQuery";
import { getContainerInstancesOfServer } from "./query/ContainerInstanceQuery";
import { queryAllStories } from "./query/StoryQuery";
import { containerId, containerInstanceId, softwareSystemId, AggregateServices, StoryServices, serverId, StorySelection } from "../core/index";
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
            Date: GraphQLDateTime,
            Query: {
                softwareSystems: (_, args, ctx) => handleFault(getSoftwareSystems(ctx.getAggregatesOfType)(args)()),
                environments: (_, args, ctx) => handleFault(getEnvironments(ctx.getAggregatesOfType)(args)()),
                stories: (_, __, ctx) => handleFault(queryAllStories(ctx.getAllStories)())
            },
            SoftwareSystem: {
                containers: (parent, args, ctx) => handleFault(getContainersOfSoftwareSystem(ctx.getAggregatesOfType)(args)(softwareSystemId(parent.id))),
                uses: (parent, args, ctx) => handleFault(getSoftwareSystemUses(ctx.getAggregatesOfType)(args)(parent.id))
            },
            Container: {
                uses: (parent, args, ctx) => handleFault(getUsesOfContainer(ctx.getAggregatesOfType)(args)(containerId(parent.id)))
            },
            Environment: {
                servers: (parent, args, ctx) => handleFault(serversOfEnvironment(ctx.getAggregatesOfType)(args)(parent.name))
            },
            Server: {
                containers: (parent, args, ctx) => handleFault(getContainerInstancesOfServer(ctx.getAggregatesOfType)(args)(serverId(parent.id)))
            },
            ContainerInstance: {
                container: (parent, args, ctx) => handleFault(getContainerOfContainerInstance(ctx.getAggregateWithId)(args)(containerInstanceId(parent.id)))
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

