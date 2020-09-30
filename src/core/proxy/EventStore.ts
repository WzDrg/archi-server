import { AggregateType, Event, AggregateId } from "../aggregates/types";

export type GetEventCount = () => number;
export type GetEventsOfAggregateType = <T extends AggregateType>(type: T) =>
    Event<T>[];
export type GetEventsOfAggregate = <T extends AggregateType>(type: T, id: string) =>
    Event<T>[];
export type StoreEvents = <T extends AggregateType>(events: Event<T>[]) => EventStore;

export interface EventStore {
    size: GetEventCount;
    get_events_of_type: GetEventsOfAggregateType;
    get_events_of_aggregate: GetEventsOfAggregate;
    store_events: StoreEvents;
}