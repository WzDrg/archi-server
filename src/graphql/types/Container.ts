import { AggregateType, eqAggregateId } from "../../core/types";
import { Container, containerId } from "../../core/aggregates/container";
import { Services } from "../../core/service";
import { Connection } from "../../core/aggregates/connection";
import { aggregateIdToReference } from "./Reference";

export const getContainers = (services: Services) =>
    () =>
        services
            .get_aggregates(AggregateType.Container)
            .map(container => ({ name: container.id.id }));

export const getContainersOfSoftwareSystem = (services: Services) =>
    (softwareSystemId: string) =>
        services
            .get_aggregates(AggregateType.Container)
            .filter((container: Container) => { return container.software_system.id === softwareSystemId })
            .map(container => ({ name: container.id.id }));

export const getContainerUses = (services: Services) =>
    (container_name: string) =>
        services
            .get_aggregates(AggregateType.Connection)
            .filter((connection: Connection) => eqAggregateId(connection.source_id, containerId(container_name)))
            .map((connection: Connection) => aggregateIdToReference(connection.target_id));