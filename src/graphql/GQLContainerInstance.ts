import { pipe } from "fp-ts/lib/pipeable";
import { filter, map } from "fp-ts/lib/Array";

import { AggregateType, AggregateId } from "../repository/types";
import { ContainerInstance } from "../repository/container_instance";
import { EventStore } from "../repository/EventStore";
import { getAggregates } from "../repository/AggregateBuilder";

export interface GQLContainerInstance {
    id: string,
    name: string
}

const toContainerInstance = (instance: ContainerInstance): GQLContainerInstance =>
    ({
        id: instance.id.id,
        name: instance.id.id
    })

export const getContainerInstancesOfServer = (event_store: EventStore) =>
    (serverId: AggregateId<AggregateType.Server>) =>
        pipe(
            getAggregates(event_store)(AggregateType.ContainerInstance),
            filter((container: ContainerInstance) =>
                container.server_id.id === serverId.id),
            map(toContainerInstance)
        )