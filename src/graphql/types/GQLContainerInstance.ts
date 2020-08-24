import { pipe } from "fp-ts/lib/pipeable";
import { filter, map } from "fp-ts/lib/Array";

import { Repository } from "../../repository/service";
import { AggregateType, AggregateId } from "../../repository/types";
import { ContainerInstance } from "../../repository/aggregates/container_instance";

export interface GQLContainerInstance {
    id: string,
    name: string
}

const toContainerInstance = (instance: ContainerInstance): GQLContainerInstance =>
    ({
        id: instance.id.id,
        name: instance.id.id
    })

export const getContainerInstancesOfServer = (services: Repository) =>
    (serverId: AggregateId<AggregateType.Server>) =>
        pipe(
            services.get_aggregates(AggregateType.ContainerInstance),
            filter((container: ContainerInstance) =>
                container.server_id.id === serverId.id),
            map(toContainerInstance)
        )