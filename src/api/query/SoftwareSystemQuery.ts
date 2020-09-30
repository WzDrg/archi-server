import { pipe } from "fp-ts/lib/pipeable";
import { map as mapEither } from "fp-ts/lib/Either";
import { map, filter } from "fp-ts/lib/Array";

import { AggregateType, eqAggregateId, SoftwareSystem, softwareSystemId, Connection, GetAggregatesOfType } from "../../core/index";
import { aggregateIdToReference } from "./Reference";

const convertSoftwareSystem = (softwareSystem: SoftwareSystem) =>
    ({
        id: softwareSystem.id.id,
        name: softwareSystem.name
    });

export const getSoftwareSystems = (getAggregatesOfType: GetAggregatesOfType) =>
    () =>
        pipe(
            getAggregatesOfType(AggregateType.SoftwareSystem),
            mapEither(map(convertSoftwareSystem))
        );

const connectionFromSoftwareSystem = (name: string) =>
    (connection: Connection) =>
        eqAggregateId(connection.sourceId, softwareSystemId(name));

const connectionToReference = (connection: Connection) =>
    aggregateIdToReference(connection.targetId);

export const getSoftwareSystemUses = (getAggregatesOfType: GetAggregatesOfType) =>
    (name: string) =>
        pipe(
            getAggregatesOfType(AggregateType.Connection),
            mapEither(filter(connectionFromSoftwareSystem(name))),
            mapEither(map(connectionToReference))
        );