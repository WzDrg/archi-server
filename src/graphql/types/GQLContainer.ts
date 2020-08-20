import { pipe } from "fp-ts/lib/pipeable";
import { filter, map } from "fp-ts/lib/Array";
import { fromNullable, map as mapOption, chain as chainOption, toNullable } from "fp-ts/lib/Option";

import { AggregateType, eqAggregateId, AggregateId } from "../../core/types";
import { Container, containerId } from "../../core/aggregates/container";
import { Services } from "../../core/service";
import { Connection } from "../../core/aggregates/connection";
import { aggregateIdToReference } from "./Reference";
import { ContainerInstance, containerInstanceId } from "../../core/aggregates/container_instance";


const toGQLContainer = (container: Container) =>
    ({ name: container.id.id });

const isContainerOfSoftwareSystem = (softwareSystemId: string) =>
    (container: Container) =>
        container.software_system.id === softwareSystemId;

export const getAllContainers = (services: Services) =>
    () =>
        pipe(
            services.get_aggregates(AggregateType.Container),
            map(toGQLContainer)
        );

export const getContainersOfSoftwareSystem = (services: Services) =>
    (softwareSystemId: string) =>
        pipe(
            services.get_aggregates(AggregateType.Container),
            filter(isContainerOfSoftwareSystem(softwareSystemId)),
            map(toGQLContainer)
        );

export const getContainerOfContainerInstance = (services: Services) =>
    (container_instance_id: AggregateId<AggregateType.ContainerInstance>) =>
        pipe(
            services.get_aggregate(container_instance_id),
            chainOption((containerInstance: ContainerInstance) => fromNullable(containerInstance.container_id)),
            chainOption(services.get_aggregate),
            mapOption(toGQLContainer),
            toNullable
        )

const isContainerSourceOfConnection = (container_id: AggregateId<AggregateType.Container>) =>
    (connection: Connection) =>
        eqAggregateId(connection.source_id, container_id);

const convertConnectionTargetToReference = (connection: Connection) =>
    aggregateIdToReference(connection.target_id);

export const getUsesOfContainer = (services: Services) =>
    (container_name: string) =>
        pipe(
            services.get_aggregates(AggregateType.Connection),
            filter(isContainerSourceOfConnection(containerId(container_name))),
            map(convertConnectionTargetToReference)
        );
