import { Option, isSome, some, none, isNone, toNullable } from "fp-ts/lib/Option";
import { Aggregate, AggregateId, AggregateType, Event, Command } from "../types";

export const connectionInstanceId = (id: string): AggregateId<AggregateType.ConnectionInstance> => ({
    id: id,
    type: AggregateType.ConnectionInstance
});

export interface ConnectionInstance extends Aggregate<AggregateType.ConnectionInstance> {
    connection_id?: AggregateId<AggregateType.Connection>;
    source_instance: AggregateId<any>;
    target_instance: AggregateId<any>;
}

const applyConnectionInstanceCreated = (id: AggregateId<AggregateType.ConnectionInstance>, source_instance: AggregateId<any>, target_instance: AggregateId<any>, connection_id?: AggregateId<AggregateType.Connection>) =>
    (state: Option<ConnectionInstance>): Option<ConnectionInstance> => {
        return isSome(state) ? state : some({
            id: id,
            connection_id: connection_id,
            source_instance: source_instance,
            target_instance: target_instance
        });
    };

export const createConnectionInstance = (id: string, source_instance: AggregateId<any>, target_instance: AggregateId<any>, connection_id?: AggregateId<AggregateType.Connection>): Command<AggregateType.ConnectionInstance> =>
    Object.assign((state: Option<ConnectionInstance>): Event<AggregateType.ConnectionInstance>[] => {
        return isSome(state) ? [] : [{
            id: connectionInstanceId(id),
            source_instance: source_instance,
            target_instance: target_instance,
            connection_id: connection_id,
            apply: applyConnectionInstanceCreated(connectionInstanceId(id), source_instance, target_instance, connection_id)
        }];
    }, { id: connectionInstanceId(id) });

const applyConnectionInstanceUpdated = (id: AggregateId<AggregateType.ConnectionInstance>, connection_id?: AggregateId<AggregateType.Connection>) =>
    (state: Option<ConnectionInstance>): Option<ConnectionInstance> => {
        return isNone(state) ? none : some({
            id: toNullable(state).id,
            connection_id: connection_id,
            source_instance: toNullable(state).source_instance,
            target_instance: toNullable(state).target_instance
        });
    }

export const updateConnectionInstance = (id: AggregateId<AggregateType.ConnectionInstance>, connection_id?: AggregateId<AggregateType.Connection>): Command<AggregateType.ConnectionInstance> =>
    Object.assign((state: Option<ConnectionInstance>): Event<AggregateType.ConnectionInstance>[] => {
        return isNone(state) ? [] : [{
            id: id,
            connection_id: connection_id,
            apply: applyConnectionInstanceUpdated(id)
        }]
    }, { id: id });

export const mergeConnectionInstance = (id: string, source_instance: AggregateId<any>, target_instance: AggregateId<any>, connection_id?: AggregateId<AggregateType.Connection>) =>
    Object.assign((state: Option<ConnectionInstance>): Event<AggregateType.ConnectionInstance>[] =>
        isNone(state)
            ? createConnectionInstance(id, source_instance, target_instance, connection_id)(state)
            : updateConnectionInstance(connectionInstanceId(id), connection_id)(state)
        , { id: connectionInstanceId(id) })