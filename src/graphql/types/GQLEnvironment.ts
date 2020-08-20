import { pipe } from "fp-ts/lib/pipeable";
import { map, uniq } from "fp-ts/lib/Array";

import { Services } from "../../core/service";
import { AggregateType } from "../../core/types";
import { Server } from "../../core/aggregates/server";
import { eqString } from "fp-ts/lib/Eq";

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
export const getEnvironments = (services: Services) =>
    (): GQLEnvironment[] =>
        pipe(
            services.get_aggregates(AggregateType.Server),
            serversToEnvironments
        );