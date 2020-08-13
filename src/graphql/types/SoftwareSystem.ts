import { AggregateType, AggregateId, eqAggregateId } from "../../core/types";
import { Services } from "../../core/service";
import { SoftwareSystem, softwareSystemId } from "../../core/aggregates/software_system";
import { Connection } from "../../core/aggregates/connection";
import { aggregateIdToReference } from "./Reference";

export const getSoftwareSystems = (services: Services) =>
    () =>
        services.get_aggregates(AggregateType.SoftwareSystem)
            .map((ss: SoftwareSystem) => ({
                name: ss.id.id
            }));

export const getSoftwareSystemUses = (services: Services) =>
    (name: string) =>
        services
            .get_aggregates(AggregateType.Connection)
            .filter((connection: Connection) => eqAggregateId(connection.source_id, softwareSystemId(name)))
            .map((connection: Connection) => aggregateIdToReference(connection.target_id));