import { pipe } from "fp-ts/lib/pipeable";
import { filter, map } from "fp-ts/lib/Array";
import { fromNullable, map as mapOption, chain as chainOption, toNullable, fold, none } from "fp-ts/lib/Option";
import { map as mapEither, chain as chainEither, right } from "fp-ts/lib/Either";

import { aggregateIdToReference } from "./Reference";
import { Container, Connection, AggregateType, eqAggregateId, AggregateId, ContainerInstance, GetAggregatesOfType, GetAggregateWithId, StorySelection } from "../../core/index";


const toGQLContainer = (container: Container) =>
    ({
        id: container.id.id,
        name: container.name
    });

const isContainerOfSoftwareSystem = (softwareSystemId: AggregateId<AggregateType.SoftwareSystem>) =>
    (container: Container) =>
        eqAggregateId(container.software_system, softwareSystemId);

export const getAllContainers = (storySelection: StorySelection) =>
    (getAggregatesOfType: GetAggregatesOfType) =>
        () =>
            pipe(
                getAggregatesOfType(storySelection)(AggregateType.Container),
                mapEither(map(toGQLContainer))
            );

export const getContainersOfSoftwareSystem = (getAggregatesOfType: GetAggregatesOfType) =>
    (storySelection: StorySelection) =>
        (softwareSystemId: AggregateId<AggregateType.SoftwareSystem>) =>
            pipe(
                getAggregatesOfType(storySelection)(AggregateType.Container),
                mapEither(filter(isContainerOfSoftwareSystem(softwareSystemId))),
                mapEither(map(toGQLContainer))
            );

export const getContainerOfContainerInstance = (getAggregateWithId: GetAggregateWithId) =>
    (storySelection: StorySelection) =>
        (container_instance_id: AggregateId<AggregateType.ContainerInstance>) =>
            pipe(
                getAggregateWithId(storySelection)(container_instance_id),
                mapEither(chainOption((containerInstance: ContainerInstance) => fromNullable(containerInstance.container_id))),
                chainEither(fold(() => right(none), getAggregateWithId(storySelection))),
                mapEither(mapOption(toGQLContainer)),
                mapEither(toNullable)
            )

const isContainerSourceOfConnection = (container_id: AggregateId<AggregateType.Container>) =>
    (connection: Connection) =>
        eqAggregateId(connection.sourceId, container_id);

const convertConnectionTargetToReference = (connection: Connection) =>
    aggregateIdToReference(connection.targetId);

export const getUsesOfContainer = (getAggregatesOfType: GetAggregatesOfType) =>
    (storySelection: StorySelection) =>
        (container_id: AggregateId<AggregateType.Container>) =>
            pipe(
                getAggregatesOfType(storySelection)(AggregateType.Connection),
                mapEither(filter(isContainerSourceOfConnection(container_id))),
                mapEither(map(convertConnectionTargetToReference))
            );
