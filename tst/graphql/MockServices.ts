import { fromNullable } from "fp-ts/lib/Option";

import { Server, serverId } from "../../src/core/aggregates/server";
import { Aggregate, AggregateType, AggregateId, eqAggregateId } from "../../src/core/types";

export const createMockServices = (aggregates: Aggregate<any>[]) => {
    const items = aggregates;
    return ({
        get_aggregates: <T extends AggregateType>(type: T) => items.filter(item => item.id.type === type) as Aggregate<T>[],
        get_aggregate: <T extends AggregateType>(id: AggregateId<T>) => fromNullable(items.find(item => eqAggregateId(id, item.id)) as Aggregate<T>),
        execute_command: jest.fn(),
        execute_commands: jest.fn()
    });
}

export const sv1: Server = {
    id: serverId("sv1"),
    name: "sv1",
    description: "",
    segment: "TST"
}

export const sv2: Server = {
    id: serverId("sv2"),
    name: "sv2",
    description: "First server",
    segment: "ACC"
};

export const sv3: Server = {
    id: serverId("sv3"),
    name: "sv3",
    description: ""
}

