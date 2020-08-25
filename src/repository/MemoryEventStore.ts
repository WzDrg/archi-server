import { GetEventsOfAggregate, GetEventsOfAggregateType, StoreEvents, EventStore, GetEventCount } from "./EventStore"
import { AggregateType, Event } from "./types"

type EventStorage = Map<AggregateType, Event<any>[]>;

const getEventsCount = (eventStorage: EventStorage): GetEventCount =>
    () =>
        Array.from(eventStorage.keys())
            .reduce((result: number, type: AggregateType) => result + getEventsOfAggregateType(eventStorage)(type).length, 0);

const getEventsOfAggregateType = (eventsByType: EventStorage): GetEventsOfAggregateType =>
    <T extends AggregateType>(type: T) =>
        eventsByType.has(type) ? eventsByType.get(type) : [];

const getEventsOfAggregate = (eventsByType: EventStorage): GetEventsOfAggregate =>
    <T extends AggregateType>(type: T, id: string) =>
        getEventsOfAggregateType(eventsByType)(type)
            .filter(event => { return event.id.id === id });

const appendEvents = (eventsByType: EventStorage): StoreEvents =>
    <T extends AggregateType>(events: Event<T>[]) => {
        if (events.length === 0)
            return memoryEventStore(eventsByType);
        const type = events[0].id.type;
        eventsByType.set(type, getEventsOfAggregateType(eventsByType)(type).concat(events));
        return memoryEventStore(eventsByType);
    }

export const memoryEventStore = (events?: EventStorage): EventStore => {
    let __events = events ?? new Map<AggregateType, Event<any>[]>();
    return {
        size: getEventsCount(__events),
        get_events_of_aggregate: getEventsOfAggregate(__events),
        get_events_of_type: getEventsOfAggregateType(__events),
        store_events: appendEvents(__events)
    };
}