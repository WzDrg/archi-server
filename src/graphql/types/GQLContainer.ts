import { pipe } from "fp-ts/lib/pipeable";
import { filter, map } from "fp-ts/lib/Array";
import { fromNullable, map as mapOption, chain as chainOption, toNullable } from "fp-ts/lib/Option";

import { AggregateType, eqAggregateId, AggregateId } from "../../repository/types";
import { Container, containerId } from "../../repository/aggregates/container";
import { Repository } from "../../repository/service";
import { Connection } from "../../repository/aggregates/connection";
import { aggregateIdToReference } from "./Reference";
import { ContainerInstance } from "../../repository/aggregates/container_instance";


const toGQLContainer = (container: Container) =>
    ({
        id: container.id.id,
        name: container.name
    });

const isContainerOfSoftwareSystem = (softwareSystemId: AggregateId<AggregateType.SoftwareSystem>) =>
    (container: Container) =>
        eqAggregateId(container.software_system, softwareSystemId);

export const getAllContainers = (services: Repository) =>
    () =>
        pipe(
            services.get_aggregates(AggregateType.Container),
            map(toGQLContainer)
        );

export const getContainersOfSoftwareSystem = (services: Repository) =>
    (softwareSystemId: AggregateId<AggregateType.SoftwareSystem>) =>
        pipe(
            services.get_aggregates(AggregateType.Container),
            filter(isContainerOfSoftwareSystem(softwareSystemId)),
            map(toGQLContainer)
        );

export const getContainerOfContainerInstance = (services: Repository) =>
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

export const getUsesOfContainer = (services: Repository) =>
    (container_id: AggregateId<AggregateType.Container>) =>
        pipe(
            services.get_aggregates(AggregateType.Connection),
            filter(isContainerSourceOfConnection(container_id)),
            map(convertConnectionTargetToReference)
        );
