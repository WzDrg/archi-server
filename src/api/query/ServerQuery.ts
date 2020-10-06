import { pipe } from "fp-ts/lib/pipeable";
import { map, filter } from "fp-ts/lib/Array";
import { map as mapEither } from "fp-ts/lib/Either";

import { AggregateType, Server, GetAggregatesOfType, StorySelection } from "../../core/index";

const coreServerToServer = (coreServer: Server) =>
    ({
        id: coreServer.id.id,
        name: coreServer.name
    });

export const serversOfEnvironment = (storySelection: StorySelection) =>
    (getAggregatesOfType: GetAggregatesOfType) =>
        (name: string) =>
            pipe(
                getAggregatesOfType(storySelection)(AggregateType.Server),
                mapEither(filter((server: Server) => name === (server.segment ?? ""))),
                mapEither(map(coreServerToServer))
            )
