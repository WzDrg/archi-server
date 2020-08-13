import { GetEventsOfAggregate, GetEventsOfAggregateType, StoreEvents, EventStore } from "../core/event_store"
import { AggregateType, Event } from "../core/types"

const getEventsOfAggregateType = (eventsByType: Map<AggregateType, Event<any>[]>): GetEventsOfAggregateType =>
    <T extends AggregateType>(type: T) =>
        eventsByType.has(type) ? eventsByType.get(type) : [];

const getEventsOfAggregate = (eventsByType: Map<AggregateType, Event<any>[]>): GetEventsOfAggregate =>
    <T extends AggregateType>(type: T, id: string) =>
        getEventsOfAggregateType(eventsByType)(type)
            .filter(event => { return event.id.id === id });

const storeEvents = (eventsByType: Map<AggregateType, Event<any>[]>): StoreEvents =>
    <T extends AggregateType>(events: Event<T>[]) => {
        if (events.length === 0)
            return [];
        const type = events[0].id.type;
        eventsByType.set(type, getEventsOfAggregateType(eventsByType)(type).concat(events));
        return events;
    }

export const memoryEventStore = (): EventStore => {
    let events = new Map<AggregateType, Event<any>[]>();
    return {
        get_events_of_aggregate: getEventsOfAggregate(events),
        get_events_of_type: getEventsOfAggregateType(events),
        store_events: storeEvents(events)
    };
}