import { pipe } from "fp-ts/lib/pipeable";
import { map, filter } from "fp-ts/lib/Array";

import { AggregateType } from "../repository/types";
import { Server } from "../repository/server";
import { EventStore } from "../repository/EventStore";
import { getAggregates } from "../repository/AggregateBuilder";

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
export const serversOfEnvironment = (event_store: EventStore) =>
    (name: string) =>
        pipe(
            getAggregates(event_store)(AggregateType.Server),
            filter((server: Server) => name === (server.segment ?? "")),
            map(coreServerToServer)
        )
