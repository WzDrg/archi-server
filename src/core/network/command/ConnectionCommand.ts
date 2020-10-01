import { Option, isSome, some, isNone } from "fp-ts/lib/Option";
import { Connection} from "../aggregate/Aggregates";
import { Command } from "./Command";
import { Event } from "../event/Event";
import { AggregateType } from "../aggregate/AggregateType";
import { AggregateId, connectionId } from "../aggregate/AggregateId";

const applyConnectionCreated = (id: AggregateId<AggregateType.Connection>, sourceId: AggregateId<any>, targetId: AggregateId<any>) =>
    (state: Option<Connection>): Option<Connection> =>
        isSome(state) ? state
            : some({
                id: id,
                sourceId: sourceId,
                targetId: targetId
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
                sourceId: source_id,
                targetId: target_id
            });

export const updateConnection = (id: AggregateId<AggregateType.Connection>, source_id: AggregateId<any>, target_id: AggregateId<any>): Command<AggregateType.Connection> =>
    Object.assign((state: Option<Connection>) => {
        return isNone(state) ? [] : [{
            id: id,
            sourceId: source_id,
            targetId: target_id,
            apply: applyConnectionUpdated(id, source_id, target_id)
        }];
    }, { id: id });

export const mergeConnection = (id: string, source_id: AggregateId<any>, target_id: AggregateId<any>): Command<AggregateType.Connection> =>
    Object.assign((state: Option<Connection>) => {
        return isNone(state)
            ? createConnection(id, source_id, target_id)(state)
            : updateConnection(connectionId(id), source_id, target_id)(state);
    }, { id: connectionId(id) });
