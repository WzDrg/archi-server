import { pipe } from "fp-ts/lib/pipeable";
import { map, filter } from "fp-ts/lib/Array";

import { Repository } from "../../repository/service";
import { AggregateType } from "../../repository/types";
import { Server } from "../../repository/aggregates/server";

// Server returned by GraphQL queries
export interface GQLServer {
    id: string,
    name: string,
}

const coreServerToServer = (coreServer: Server): GQLServer =>
    ({
        id: coreServer.id.id,
        name: coreServer.name
    });

// Find the servers 
export const serversOfEnvironment = (services: Repository) =>
    (name: string) =>
        pipe(
            services.get_aggregates(AggregateType.Server),
            filter((server: Server) => name === (server.segment ?? "")),
            map(coreServerToServer)
        )
