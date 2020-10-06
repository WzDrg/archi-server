import { pipe } from "fp-ts/lib/pipeable";
import { filter, map } from "fp-ts/lib/Array";
import { map as mapEither } from "fp-ts/lib/Either";

import { ContainerInstance, AggregateId, GetAggregatesOfType, AggregateType, StorySelection } from "../../core/index";

export interface GQLContainerInstance {
    id: string,
    name: string
}

const toContainerInstance = (instance: ContainerInstance): GQLContainerInstance =>
    ({
        id: instance.id.id,
        name: instance.id.id
    })

export const getContainerInstancesOfServer = (getAggregatesOfType: GetAggregatesOfType) =>
    (storySelection:StorySelection)=>
    (serverId: AggregateId<AggregateType.Server>) =>
        pipe(
            getAggregatesOfType(storySelection)(AggregateType.ContainerInstance),
            mapEither(filter((container: ContainerInstance) =>
                container.server_id.id === serverId.id)),
            mapEither(map(toContainerInstance))
        )
