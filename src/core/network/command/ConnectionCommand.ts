import { Option, isSome, some, isNone, toNullable } from "fp-ts/lib/Option";
import { Connection } from "../aggregate/Aggregates";
import { Command } from "./Command";
import { Event } from "../event/Event";
import { AggregateType } from "../aggregate/AggregateType";
import { AggregateId, connectionId } from "../aggregate/AggregateId";

const applyConnectionCreated = (id: AggregateId<AggregateType.Connection>, date: Date, sourceId: AggregateId<any>, targetId: AggregateId<any>) =>
    (state: Option<Connection>): Option<Connection> =>
        isSome(state) ? state
            : some({
                id: id,
                createdOn: date,
                updatedOn: date,
                sourceId: sourceId,
                targetId: targetId
            });

export const createConnection = (id: string, date: Date, source_id: AggregateId<any>, target_id: AggregateId<any>): Command<AggregateType.Connection> =>
    Object.assign((state: Option<Connection>): Event<AggregateType.Connection>[] => {
        return isSome(state) ? []
            : [{
                id: connectionId(id),
                date: date,
                apply: applyConnectionCreated(connectionId(id), date, source_id, target_id)
            }];
    }, { id: connectionId(id) });

const applyConnectionUpdated = (id: AggregateId<AggregateType.Connection>, date, source_id: AggregateId<any>, target_id: AggregateId<any>) =>
    (state: Option<Connection>): Option<Connection> =>
        isNone(state) ? state
            : some({
                id: id,
                createdOn: toNullable(state).createdOn,
                updatedOn: date,
                sourceId: source_id,
                targetId: target_id
            });

export const updateConnection = (id: AggregateId<AggregateType.Connection>, date: Date, source_id: AggregateId<any>, target_id: AggregateId<any>): Command<AggregateType.Connection> =>
    Object.assign((state: Option<Connection>) => {
        return isNone(state) ? [] : [{
            id: id,
            date: date,
            sourceId: source_id,
            targetId: target_id,
            apply: applyConnectionUpdated(id, date, source_id, target_id)
        }];
    }, { id: id });

export const mergeConnection = (id: string, date: Date, source_id: AggregateId<any>, target_id: AggregateId<any>): Command<AggregateType.Connection> =>
    Object.assign((state: Option<Connection>) => {
        return isNone(state)
            ? createConnection(id, date, source_id, target_id)(state)
            : updateConnection(connectionId(id), date, source_id, target_id)(state);
    }, { id: connectionId(id) });
