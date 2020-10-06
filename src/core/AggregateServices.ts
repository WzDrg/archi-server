import { Option, none, isSome, toNullable } from "fp-ts/lib/Option";
import { reduce, map, filter } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { toArray } from "fp-ts/lib/Record";
import { Either, map as mapEither } from "fp-ts/lib/Either";

import { Aggregate } from "./network/aggregate/Aggregates";
import { Event } from "./network/event/Event";
import { AggregateType } from "./network/aggregate/AggregateType";
import { EventStore } from "./network/event/EventStorage";
import { GetStoriesFromStorage, StorySelection, StoryStorage } from "./proxy/StoryStorage";
import { Fault } from "./Fault";
import { eventStoreFromStories } from "./story/EventStoreBuilder";
import { AggregateId } from "./network/aggregate/AggregateId";

const eventsToAggregate = <T extends AggregateType>(events: Event<T>[]) =>
    reduce(none, (state: Option<Aggregate<T>>, event: Event<T>) => event.apply(state))(events);

const groupById = <T extends AggregateType>(events: Event<T>[]): Event<T>[][] =>
    pipe(
        events.reduce((result, event) => {
            (result[event.id.id] = result[event.id.id] || []).push(event);
            return result;
        }, {}),
        toArray,
        map(([K, V]) => V)
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

export const getAggregateWithIdFromEventStore = <T extends AggregateType>(id: AggregateId<T>) =>
    (eventStore: EventStore) =>
        pipe(
            eventStore.get_events_of_aggregate(id.type, id.id),
            eventsToAggregate
        );

const buildEventStoreFromStorySelection = (getStories: GetStoriesFromStorage) =>
    (storySelection: StorySelection) =>
        pipe(
            getStories(storySelection),
            mapEither(eventStoreFromStories)
        );

const getAggregatesOfTypeFromStorySelection = (getStories: GetStoriesFromStorage) =>
    (storySelection: StorySelection) =>
        <T extends AggregateType>(t: T) =>
            pipe(
                buildEventStoreFromStorySelection(getStories)(storySelection),
                mapEither(getAggregatesOfTypeFromEventStore(t))
            );

const getAggregateWithIdFromStorySelection = (getStories: GetStoriesFromStorage) =>
    (storySelection: StorySelection) =>
        <T extends AggregateType>(id: AggregateId<T>) =>
            pipe(
                buildEventStoreFromStorySelection(getStories)(storySelection),
                mapEither(getAggregateWithIdFromEventStore(id))
            );

export type GetAggregatesOfType = (storySelection: StorySelection) => <T extends AggregateType>(t: T) => Either<Fault, Aggregate<T>[]>;
export type GetAggregateWithId = (storySelection: StorySelection) => <T extends AggregateType>(id: AggregateId<T>) => Either<Fault, Option<Aggregate<T>>>;
export interface AggregateServices {
    getAggregatesOfType: GetAggregatesOfType;
    getAggregateWithId: GetAggregateWithId;
}

export const aggregateServices = (storyStorage: StoryStorage) =>
    ({
        getAggregatesOfType: getAggregatesOfTypeFromStorySelection(storyStorage.getStories),
        getAggregateWithId: getAggregateWithIdFromStorySelection(storyStorage.getStories)
    });
