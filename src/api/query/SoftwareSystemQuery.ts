import { pipe } from "fp-ts/lib/pipeable";
import { map as mapEither } from "fp-ts/lib/Either";
import { map, filter } from "fp-ts/lib/Array";

import { SoftwareSystem, Connection, GetAggregatesOfType, softwareSystemId, eqAggregateId, StorySelection } from "../../core/index";
import { aggregateIdToReference } from "./Reference";
import { AggregateType } from "../../core/network/aggregate/AggregateType";

const convertSoftwareSystem = (softwareSystem: SoftwareSystem) =>
    ({
        id: softwareSystem.id.id,
        name: softwareSystem.name
    });

export const getSoftwareSystems = (getAggregatesOfType: GetAggregatesOfType) =>
    (storySelection: StorySelection) =>
        () =>
            pipe(
                getAggregatesOfType(storySelection)(AggregateType.SoftwareSystem),
                mapEither(map(convertSoftwareSystem))
            );

const connectionFromSoftwareSystem = (name: string) =>
    (connection: Connection) =>
        eqAggregateId(connection.sourceId, softwareSystemId(name));

const connectionToReference = (connection: Connection) =>
    aggregateIdToReference(connection.targetId);

export const getSoftwareSystemUses = (storySelection: StorySelection) =>
    (getAggregatesOfType: GetAggregatesOfType) =>
        (name: string) =>
            pipe(
                getAggregatesOfType(storySelection)(AggregateType.Connection),
                mapEither(filter(connectionFromSoftwareSystem(name))),
                mapEither(map(connectionToReference))
            );
