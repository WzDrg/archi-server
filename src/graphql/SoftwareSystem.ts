import { pipe } from "fp-ts/lib/pipeable";
import { map, filter } from "fp-ts/lib/Array";

import { AggregateType, eqAggregateId } from "../repository/types";
import { getAggregates } from "../repository/AggregateBuilder";
import { SoftwareSystem, softwareSystemId } from "../repository/software_system";
import { Connection } from "../repository/connection";
import { aggregateIdToReference } from "./Reference";
import { EventStore } from "../repository/EventStore";

const convertToSoftwareSystem = (softwareSystem: SoftwareSystem) =>
    ({
        id: softwareSystem.id.id,
        name: softwareSystem.name
    });

export const getSoftwareSystems = (event_store: EventStore) =>
    () =>
        pipe(
            getAggregates(event_store)(AggregateType.SoftwareSystem),
            map(convertToSoftwareSystem)
        );

export const getSoftwareSystemUses = (event_store: EventStore) =>
    (name: string) =>
        pipe(
            getAggregates(event_store)(AggregateType.Connection),
            filter((connection: Connection) => eqAggregateId(connection.source_id, softwareSystemId(name))),
            map((connection: Connection) => aggregateIdToReference(connection.target_id))
        );