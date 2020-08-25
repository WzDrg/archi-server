import { pipe } from "fp-ts/lib/pipeable";
import { map, uniq } from "fp-ts/lib/Array";

import { AggregateType } from "../repository/types";
import { Server } from "../repository/server";
import { eqString } from "fp-ts/lib/Eq";
import { EventStore } from "../repository/EventStore";
import { getAggregates } from "../repository/AggregateBuilder";

interface GQLEnvironment {
    name: string
};

// Construct all possible environments using the servers
const serversToEnvironments = (servers: Server[]): GQLEnvironment[] =>
    pipe(
        servers,
        map(server => server.segment ?? ""),
        uniq(eqString),
        map(name => ({ name: name }))
    );

// Retrieve a list of all environments
export const getEnvironments = (event_store: EventStore) =>
    (): GQLEnvironment[] =>
        pipe(
            getAggregates(event_store)(AggregateType.Server),
            serversToEnvironments
        );