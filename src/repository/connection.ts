import { Option, isSome, some, isNone } from "fp-ts/lib/Option";
import { Aggregate, AggregateId, AggregateType, Event, Command } from "./types";

export const connectionId = (id: string): AggregateId<AggregateType.Connection> => ({
    id: id,
    type: AggregateType.Connection
});

export interface Connection extends Aggregate<AggregateType.Connection> {
    source_id: AggregateId<any>;
    target_id: AggregateId<any>;
}

const applyConnectionCreated = (id: AggregateId<AggregateType.Connection>, source_id: AggregateId<any>, target_id: AggregateId<any>) =>
    (state: Option<Connection>): Option<Connection> =>
        isSome(state) ? state
            : some({
                id: id,
                source_id: source_id,
                target_id: target_id
            });

export const createConnection = (id: string, source_id: AggregateId<any>, target_id: AggregateId<any>): Command<AggregateType.Connection> =>
    Object.assign((state: Option<Connection>): Event<AggregateType.Connection>[] => {
        return isSome(state) ? []
            : [{
                id: connectionId(id),
                apply: applyConnectionCreated(connectionId(id), source_id, target_id)
            }];
    }, { id: connectionId(id) });

const applyConnectionUpdated = (id: AggregateId<AggregateType.Connection>, source_id: AggregateId<any>, target_id: AggregateId<any>) =>
    (state: Option<Connection>): Option<Connection> =>
        isNone(state) ? state
            : some({
                id: id,
                source_id: source_id,
                target_id: target_id
            });

export const updateConnection = (id: AggregateId<AggregateType.Connection>, source_id: AggregateId<any>, target_id: AggregateId<any>): Command<AggregateType.Connection> =>
    Object.assign((state: Option<Connection>) => {
        return isNone(state) ? [] : [{
            id: id,
            source_id: source_id,
            target_id: target_id,
            apply: applyConnectionUpdated(id, source_id, target_id)
        }];
    }, { id: id });

export const mergeConnection = (id: string, source_id: AggregateId<any>, target_id: AggregateId<any>): Command<AggregateType.Connection> =>
    Object.assign((state: Option<Connection>) => {
        return isNone(state)
            ? createConnection(id, source_id, target_id)(state)
            : updateConnection(connectionId(id), source_id, target_id)(state);
    }, { id: connectionId(id) });