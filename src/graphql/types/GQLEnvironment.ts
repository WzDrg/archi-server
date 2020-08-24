import { pipe } from "fp-ts/lib/pipeable";
import { map, uniq } from "fp-ts/lib/Array";

import { Repository } from "../../repository/service";
import { AggregateType } from "../../repository/types";
import { Server } from "../../repository/aggregates/server";
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
export const getEnvironments = (services: Repository) =>
    (): GQLEnvironment[] =>
        pipe(
            services.get_aggregates(AggregateType.Server),
            serversToEnvironments
        );