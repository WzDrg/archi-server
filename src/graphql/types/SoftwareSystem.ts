import { pipe } from "fp-ts/lib/pipeable";
import { map, filter } from "fp-ts/lib/Array";

import { AggregateType, eqAggregateId } from "../../core/types";
import { Services } from "../../core/service";
import { SoftwareSystem, softwareSystemId } from "../../core/aggregates/software_system";
import { Connection } from "../../core/aggregates/connection";
import { aggregateIdToReference } from "./Reference";

const convertToSoftwareSystem = (softwareSystem: SoftwareSystem) =>
    ({
        id: softwareSystem.id.id,
        name: softwareSystem.name
    });

export const getSoftwareSystems = (services: Services) =>
    () =>
        pipe(
            services.get_aggregates(AggregateType.SoftwareSystem),
            map(convertToSoftwareSystem)
        );

export const getSoftwareSystemUses = (services: Services) =>
    (name: string) =>
        pipe(
            services.get_aggregates(AggregateType.Connection),
            filter((connection: Connection) => eqAggregateId(connection.source_id, softwareSystemId(name))),
            map((connection: Connection) => aggregateIdToReference(connection.target_id))
        );