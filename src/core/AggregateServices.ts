import { Option, none, isSome, toNullable } from "fp-ts/lib/Option";
import { reduce, map, filter } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { toArray } from "fp-ts/lib/Record";

import { Aggregate, AggregateType, AggregateId, Event } from "./network/model/Aggregates";
import { Story } from "./story/Story";
import { EventStore } from "./network/EventStore";
import { StoryStore } from "./proxy/StoryStore";
import { Either, map as mapEither } from "fp-ts/lib/Either";
import { Fault } from "./Fault";
import { eventStoreFromStories } from "./story/EventStoreBuilder";

export type GetAggregate = <T extends AggregateType>(id: AggregateId<T>) => Option<Aggregate<T>>;
export type GetAggregates = <T extends AggregateType>(type: T) => Aggregate<T>[];

const eventsToAggregate = <T extends AggregateType>(events: Event<T>[]) =>
    reduce(none, (state: Option<Aggregate<T>>, event: Event<T>) => event.apply(state))(events);

export const getAggregate = (eventStore: EventStore): GetAggregate =>
    <T extends AggregateType>(id: AggregateId<T>) =>
        pipe(
            eventStore.get_events_of_aggregate(id.type, id.id),
            eventsToAggregate
        );

const groupById = <T extends AggregateType>(events: Event<T>[]): Event<T>[][] =>
    pipe(
        events.reduce((result, event) => {
            (result[event.id.id] = result[event.id.id] || []).push(event);
            return result;
        }, {}),
        toArray,
        map(([K, V]) => V)
    );

// Get all aggregates of a specific type
export const getAggregates = (eventStore: EventStore): GetAggregates =>
    <T extends AggregateType>(type: T) =>
        pipe(
            eventStore.get_events_of_type(type),
            groupById,
            map(eventsToAggregate),
            filter(isSome),
            map(toNullable)
        );

const getAggregatesOfTypeFromEventStore = <T extends AggregateType>(type: T) =>
    (eventStore: EventStore) =>
        pipe(
            eventStore.get_events_of_type(type),
            groupById,
            map(eventsToAggregate),
            filter(isSome),
            map(toNullable)
        );


const getAggregatesOfType = (getAllStories: () => Either<Fault, Story[]>) =>
    <T extends AggregateType>(type: T) =>
        pipe(
            getAllStories(),
            mapEither(eventStoreFromStories),
            mapEither(getAggregatesOfTypeFromEventStore(type))
        );

const getAggregateWithIdFromEventStore = <T extends AggregateType>(id: AggregateId<T>) =>
    (eventStore: EventStore) =>
        pipe(
            eventStore.get_events_of_aggregate(id.type, id.id),
            eventsToAggregate
        );

const getAggregateWithId = (getAllStories: () => Either<Fault, Story[]>) =>
    <T extends AggregateType>(id: AggregateId<T>) =>
        pipe(
            getAllStories(),
            mapEither(eventStoreFromStories),
            mapEither(getAggregateWithIdFromEventStore(id))
        );


export type GetAggregatesOfType = <T extends AggregateType>(t: T) => Either<Fault, Aggregate<T>[]>;
export type GetAggregateWithId = <T extends AggregateType>(id: AggregateId<T>) => Either<Fault, Option<Aggregate<T>>>;
export interface AggregateServices {
    getAggregatesOfType: GetAggregatesOfType;
    getAggregateWithId: GetAggregateWithId;
}

export const aggregateServices = (storyStore: StoryStore): AggregateServices => ({
    getAggregatesOfType: getAggregatesOfType(storyStore.getAllStories),
    getAggregateWithId: getAggregateWithId(storyStore.getAllStories)
});
