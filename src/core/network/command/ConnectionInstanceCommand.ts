import { Option, isSome, some, none, isNone, toNullable } from "fp-ts/lib/Option";
import { ConnectionInstance } from "../aggregate/Aggregates";
import { Command } from "./Command";
import { Event } from "../event/Event";
import { AggregateType } from "../aggregate/AggregateType";
import { AggregateId, connectionInstanceId } from "../aggregate/AggregateId";

const applyConnectionInstanceCreated = (id: AggregateId<AggregateType.ConnectionInstance>, date: Date, source_instance: AggregateId<any>, target_instance: AggregateId<any>, connection_id?: AggregateId<AggregateType.Connection>) =>
    (state: Option<ConnectionInstance>): Option<ConnectionInstance> => {
        return isSome(state) ? state : some({
            id: id,
            createdOn: date,
            updatedOn: date,
            connection_id: connection_id,
            source_instance: source_instance,
            target_instance: target_instance
        });
    };

export const createConnectionInstance = (id: string, date: Date, source_instance: AggregateId<any>, target_instance: AggregateId<any>, connection_id?: AggregateId<AggregateType.Connection>): Command<AggregateType.ConnectionInstance> =>
    Object.assign((state: Option<ConnectionInstance>): Event<AggregateType.ConnectionInstance>[] => {
        return isSome(state) ? [] : [{
            id: connectionInstanceId(id),
            date: date,
            source_instance: source_instance,
            target_instance: target_instance,
            connection_id: connection_id,
            apply: applyConnectionInstanceCreated(connectionInstanceId(id), date, source_instance, target_instance, connection_id)
        }];
    }, { id: connectionInstanceId(id) });

const applyConnectionInstanceUpdated = (id: AggregateId<AggregateType.ConnectionInstance>, date: Date, connection_id?: AggregateId<AggregateType.Connection>) =>
    (state: Option<ConnectionInstance>): Option<ConnectionInstance> => {
        return isNone(state) ? none : some({
            id: toNullable(state).id,
            createdOn: toNullable(state).createdOn,
            updatedOn: date,
            connection_id: connection_id,
            source_instance: toNullable(state).source_instance,
            target_instance: toNullable(state).target_instance
        });
    }

export const updateConnectionInstance = (id: AggregateId<AggregateType.ConnectionInstance>, date: Date, connection_id?: AggregateId<AggregateType.Connection>): Command<AggregateType.ConnectionInstance> =>
    Object.assign((state: Option<ConnectionInstance>): Event<AggregateType.ConnectionInstance>[] => {
        return isNone(state) ? [] : [{
            id: id,
            date: date,
            connection_id: connection_id,
            apply: applyConnectionInstanceUpdated(id, date)
        }]
    }, { id: id });

export const mergeConnectionInstance = (id: string, date: Date, source_instance: AggregateId<any>, target_instance: AggregateId<any>, connection_id?: AggregateId<AggregateType.Connection>) =>
    Object.assign((state: Option<ConnectionInstance>): Event<AggregateType.ConnectionInstance>[] =>
        isNone(state)
            ? createConnectionInstance(id, date, source_instance, target_instance, connection_id)(state)
            : updateConnectionInstance(connectionInstanceId(id), date, connection_id)(state)
        , { id: connectionInstanceId(id) })