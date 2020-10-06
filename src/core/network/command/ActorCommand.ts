import { Option, isSome, some, isNone, toNullable } from "fp-ts/lib/Option";
import { Actor } from "../aggregate/Aggregates";
import { Command } from "./Command";
import { Event } from "../event/Event";
import { AggregateType } from "../aggregate/AggregateType";
import { actorId, AggregateId } from "../aggregate/AggregateId";

const applyActorCreated = (id: AggregateId<AggregateType.Actor>, date: Date, name: string, description: string) =>
    (state: Option<Actor>): Option<Actor> =>
        isSome(state) ? state
            : some({
                id: id,
                createdOn: date,
                updatedOn: date,
                name: name,
                description: description
            });

export const createActor = (date: Date, name: string, description: string): Command<AggregateType.Actor> =>
    Object.assign((state: Option<Actor>): Event<AggregateType.Actor>[] => {
        return isSome(state) ? []
            : [{
                id: actorId(name),
                date: date,
                name: name,
                description: description,
                apply: applyActorCreated(actorId(name), date, name, description)
            }];
    }, { id: actorId(name) });

const applyActorUpdated = (id: AggregateId<AggregateType.Actor>, date: Date, description: string) =>
    (state: Option<Actor>): Option<Actor> =>
        isNone(state) ? state
            : some({
                id: id,
                createdOn: toNullable(state).createdOn,
                updatedOn: date,
                name: toNullable(state).name,
                description: description
            });

export const updateActor = (id: AggregateId<AggregateType.Actor>, date: Date, description: string): Command<AggregateType.Actor> =>
    Object.assign((state: Option<Actor>) => {
        return isNone(state) ? [] : [{
            id: id,
            date: date,
            description: description,
            apply: applyActorUpdated(id, date, description)
        }];
    }, { id: id });

export const mergeActor = (date: Date, name: string, description: string): Command<AggregateType.Actor> =>
    Object.assign((state: Option<Actor>) => {
        return isNone(state)
            ? createActor(date, name, description)(state)
            : updateActor(actorId(name), date, description)(state);
    }, { id: actorId(name) });