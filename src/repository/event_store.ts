import { AggregateType, Event, AggregateId } from "./types";

// Retrieve all events of a specific aggregate type
export type GetEventsOfAggregateType = <T extends AggregateType>(type: T) =>
    Event<T>[];

// Retrieve the events of a specific aggregate
export type GetEventsOfAggregate = <T extends AggregateType>(type: T, id: string) =>
    Event<T>[];

// Store the events by aggregate type of a specific aggregate type
export type StoreEvents = <T extends AggregateType>(events: Event<T>[]) => Event<T>[];

export interface EventStore {
    get_events_of_type: GetEventsOfAggregateType;
    get_events_of_aggregate: GetEventsOfAggregate;
    store_events: StoreEvents;
}