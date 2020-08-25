import { pipe } from "fp-ts/lib/pipeable";
import { filter, map } from "fp-ts/lib/Array";
import { fromNullable, map as mapOption, chain as chainOption, toNullable } from "fp-ts/lib/Option";

import { AggregateType, eqAggregateId, AggregateId } from "../repository/types";
import { Container } from "../repository/container";
import { Connection } from "../repository/connection";
import { aggregateIdToReference } from "./Reference";
import { ContainerInstance } from "../repository/container_instance";
import { EventStore } from "../repository/EventStore";
import { getAggregates, getAggregate } from "../repository/AggregateBuilder";


const toGQLContainer = (container: Container) =>
    ({
        id: container.id.id,
        name: container.name
    });

const isContainerOfSoftwareSystem = (softwareSystemId: AggregateId<AggregateType.SoftwareSystem>) =>
    (container: Container) =>
        eqAggregateId(container.software_system, softwareSystemId);

export const getAllContainers = (event_store: EventStore) =>
    () =>
        pipe(
            getAggregates(event_store)(AggregateType.Container),
            map(toGQLContainer)
        );

export const getContainersOfSoftwareSystem = (event_store: EventStore) =>
    (softwareSystemId: AggregateId<AggregateType.SoftwareSystem>) =>
        pipe(
            getAggregates(event_store)(AggregateType.Container),
            filter(isContainerOfSoftwareSystem(softwareSystemId)),
            map(toGQLContainer)
        );

export const getContainerOfContainerInstance = (event_store: EventStore) =>
    (container_instance_id: AggregateId<AggregateType.ContainerInstance>) =>
        pipe(
            getAggregate(event_store)(container_instance_id),
            chainOption((containerInstance: ContainerInstance) => fromNullable(containerInstance.container_id)),
            chainOption(getAggregate(event_store)),
            mapOption(toGQLContainer),
            toNullable
        )

const isContainerSourceOfConnection = (container_id: AggregateId<AggregateType.Container>) =>
    (connection: Connection) =>
        eqAggregateId(connection.source_id, container_id);

const convertConnectionTargetToReference = (connection: Connection) =>
    aggregateIdToReference(connection.target_id);

export const getUsesOfContainer = (event_store: EventStore) =>
    (container_id: AggregateId<AggregateType.Container>) =>
        pipe(
            getAggregates(event_store)(AggregateType.Connection),
            filter(isContainerSourceOfConnection(container_id)),
            map(convertConnectionTargetToReference)
        );
