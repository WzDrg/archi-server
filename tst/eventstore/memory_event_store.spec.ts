import { none } from "fp-ts/lib/Option"
import { memoryEventStore } from "../../src/eventstore/memory_event_store";
import { AggregateType } from "../../src/core/types";
import { createServer } from "../../src/core/aggregates/server";

describe("get_events_of_aggregate_type", () => {
    it("should return empty array of events", () => {
        let event_store = memoryEventStore();
        const events = event_store.get_events_of_type(AggregateType.Server);
        expect(events).toBeDefined();
        expect(events).toHaveLength(0);
    });
});

describe("store_events", () => {
    it("should store a single event", () => {
        let event_store = memoryEventStore();
        const events = event_store.store_events(createServer("name", "description")(none));
        expect(events).toHaveLength(1);
        const stored_events = event_store.get_events_of_type(AggregateType.Server);
        expect(stored_events).toHaveLength(1);
    });

    it("should not fail when storing no events", () => {
        let event_store = memoryEventStore();
        const events = event_store.store_events([]);
        expect(events).toHaveLength(0);
    });
});