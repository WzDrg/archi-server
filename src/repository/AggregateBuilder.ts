import { Option, none, isSome, toNullable } from "fp-ts/lib/Option";
import { reduce, map, filter } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { toArray } from "fp-ts/lib/Record";

import { Aggregate, AggregateType, AggregateId, Event } from "./types";
import { EventStore } from "./EventStore";

type GetAggregate = <T extends AggregateType>(id: AggregateId<T>) => Option<Aggregate<T>>;
type GetAggregates = <T extends AggregateType>(type: T) => Aggregate<T>[];

const eventsToAggregate = <T extends AggregateType>(events: Event<T>[]) =>
    reduce(none, (state: Option<Aggregate<T>>, event: Event<T>) => event.apply(state))(events);

// Construct a single aggregate using the available events
export const getAggregate = (event_store: EventStore): GetAggregate =>
    <T extends AggregateType>(id: AggregateId<T>) =>
        pipe(
            event_store.get_events_of_aggregate(id.type, id.id),
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
export const getAggregates = (event_store: EventStore): GetAggregates =>
    <T extends AggregateType>(type: T) =>
        pipe(
            event_store.get_events_of_type(type),
            groupById,
            map(eventsToAggregate),
            filter(isSome),
            map(toNullable)
        );