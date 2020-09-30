import { pipe } from "fp-ts/lib/pipeable";
import { map, uniq } from "fp-ts/lib/Array";
import { eqString } from "fp-ts/lib/Eq";
import { map as mapEither } from "fp-ts/lib/Either";

import { AggregateType, Server, AggregateServices, GetAggregatesOfType } from "../../core/index";

const serversToEnvironments = (servers: Server[]) =>
    pipe(
        servers,
        map(server => server.segment ?? ""),
        uniq(eqString),
        map(_name => ({ name: _name }))
    );

export const getEnvironments = (getAggregatesOfType: GetAggregatesOfType) =>
    () =>
        pipe(
            getAggregatesOfType(AggregateType.Server),
            mapEither(serversToEnvironments)
        );
