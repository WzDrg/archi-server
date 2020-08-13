import { isSome } from "fp-ts/lib/Option";
import { services } from "./service";
import { memoryEventStore } from "../eventstore/memory_event_store";
import { AggregateType } from "./types";
import { createServer } from "./aggregates/server";

describe("execute_commands", () => {
    it("should store the events", () => {
        let _event_store = memoryEventStore();
        services(_event_store).execute_command(createServer("server", "description"));
        const events = _event_store.get_events_of_type(AggregateType.Server);
        expect(events).toHaveLength(1);
    });
})

describe("getAggregate", () => {

    it("should retrieve a single aggregate", () => {
        let _event_store = memoryEventStore();
        services(_event_store).execute_command(createServer("server", "description"));
        const server = services(_event_store).get_aggregate(AggregateType.Server, "server");
        expect(isSome(server)).toBeTruthy();
    });
});

describe("getAggregates", () => {
    it("should retrieve a single aggregate", () => {
        let _event_store = memoryEventStore();
        services(_event_store).execute_command(createServer("server", "description"));
        const servers = services(_event_store).get_aggregates(AggregateType.Server);
        expect(servers).toHaveLength(1);
    });

})