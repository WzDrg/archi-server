import { none } from "fp-ts/lib/Option"
import { memoryEventStore } from "../../src/repository/MemoryEventStore";
import { AggregateType } from "../../src/repository/types";
import { createServer } from "../../src/repository/server";

describe("AppendEvent", () => {
    it("should return empty array of events", () => {
        let event_store = memoryEventStore();
        const events = event_store.get_events_of_type(AggregateType.Server);
        expect(events).toBeDefined();
        expect(events).toHaveLength(0);
    });

    it("should store a single event", () => {
        let event_store = memoryEventStore();
        const result = event_store.store_events(createServer("name", "description")(none));
        expect(result.size()).toEqual(1);
        const stored_events = event_store.get_events_of_type(AggregateType.Server);
        expect(stored_events).toHaveLength(1);
    });

    it("should not fail when storing no events", () => {
        let event_store = memoryEventStore();
        const result = event_store.store_events([]);
        expect(result.size()).toEqual(0);
    });
});