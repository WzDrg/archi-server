import { pipe } from "fp-ts/lib/pipeable";
import { map, filter } from "fp-ts/lib/Array";

import { Services } from "../../core/service";
import { AggregateType } from "../../core/types";
import { Server as CoreServer } from "../../core/aggregates/server";

// Server returned by GraphQL queries
export interface Server {
    name: string
}

const coreServerToServer = (coreServer: CoreServer): Server =>
    ({
        name: coreServer.name
    });

// Find the servers 
export const serversOfEnvironment = (services: Services) =>
    (name: string) =>
        pipe(
            services.get_aggregates(AggregateType.Server),
            filter((server: CoreServer) => name === (server.segment ?? "")),
            map(coreServerToServer)
        )
