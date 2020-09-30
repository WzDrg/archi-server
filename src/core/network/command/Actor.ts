import { Option, isSome, some, isNone, toNullable } from "fp-ts/lib/Option";
import { AggregateId, AggregateType, Event, Command, Actor, actorId } from "../model/Aggregates";

const applyActorCreated = (id: AggregateId<AggregateType.Actor>, name: string, description: string) =>
    (state: Option<Actor>): Option<Actor> =>
        isSome(state) ? state
            : some({
                id: id,
                name: name,
                description: description
            });

export const createActor = (name: string, description: string): Command<AggregateType.Actor> =>
    Object.assign((state: Option<Actor>): Event<AggregateType.Actor>[] => {
        return isSome(state) ? []
            : [{
                id: actorId(name),
                name: name,
                description: description,
                apply: applyActorCreated(actorId(name), name, description)
            }];
    }, { id: actorId(name) });

const applyActorUpdated = (id: AggregateId<AggregateType.Actor>, description: string) =>
    (state: Option<Actor>): Option<Actor> =>
        isNone(state) ? state
            : some({
                id: id,
                name: toNullable(state).name,
                description: description
            });

export const updateActor = (id: AggregateId<AggregateType.Actor>, description: string): Command<AggregateType.Actor> =>
    Object.assign((state: Option<Actor>) => {
        return isNone(state) ? [] : [{
            id: id,
            description: description,
            apply: applyActorUpdated(id, description)
        }];
    }, { id: id });

export const mergeActor = (name: string, description: string): Command<AggregateType.Actor> =>
    Object.assign((state: Option<Actor>) => {
        return isNone(state)
            ? createActor(name, description)(state)
            : updateActor(actorId(name), description)(state);
    }, { id: actorId(name) });