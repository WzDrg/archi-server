import { pipe } from "fp-ts/lib/pipeable";
import { map, filter } from "fp-ts/lib/Array";

import { AggregateType, eqAggregateId } from "../../repository/types";
import { Repository } from "../../repository/service";
import { SoftwareSystem, softwareSystemId } from "../../repository/aggregates/software_system";
import { Connection } from "../../repository/aggregates/connection";
import { aggregateIdToReference } from "./Reference";

const convertToSoftwareSystem = (softwareSystem: SoftwareSystem) =>
    ({
        id: softwareSystem.id.id,
        name: softwareSystem.name
    });

export const getSoftwareSystems = (services: Repository) =>
    () =>
        pipe(
            services.get_aggregates(AggregateType.SoftwareSystem),
            map(convertToSoftwareSystem)
        );

export const getSoftwareSystemUses = (services: Repository) =>
    (name: string) =>
        pipe(
            services.get_aggregates(AggregateType.Connection),
            filter((connection: Connection) => eqAggregateId(connection.source_id, softwareSystemId(name))),
            map((connection: Connection) => aggregateIdToReference(connection.target_id))
        );