import { pipe } from "fp-ts/lib/pipeable";
import { map, uniq } from "fp-ts/lib/Array";
import { eqString } from "fp-ts/lib/Eq";
import { map as mapEither } from "fp-ts/lib/Either";

import { Server, GetAggregatesOfType, AggregateType, StorySelection } from "../../core/index";

const serversToEnvironments = (servers: Server[]) =>
    pipe(
        servers,
        map(server => server.segment ?? ""),
        uniq(eqString),
        map(_name => ({ name: _name }))
    );

export const getEnvironments = (getAggregatesOfType: GetAggregatesOfType) =>
    (storySelection: StorySelection) =>
        () =>
            pipe(
                getAggregatesOfType(storySelection)(AggregateType.Server),
                mapEither(serversToEnvironments)
            );
