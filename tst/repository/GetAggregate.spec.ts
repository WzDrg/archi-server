import { isSome } from "fp-ts/lib/Option";
import { memoryEventStore } from "../../src/repository/MemoryEventStore";
import { AggregateType } from "../../src/repository/types";
import { createServer, serverId } from "../../src/repository/server";
import { appendCommand } from "../../src/repository/CommandAppender";
import { getAggregates, getAggregate } from "../../src/repository/AggregateBuilder";

describe("execute_commands", () => {
    it("should store the events", () => {
        let _event_store = memoryEventStore();
        appendCommand(_event_store)(createServer("server", "description"));
        const events = _event_store.get_events_of_type(AggregateType.Server);
        expect(events).toHaveLength(1);
    });
})

describe("GetAggregate", () => {

    it("should retrieve a single aggregate", () => {
        let _event_store = memoryEventStore();
        appendCommand(_event_store)(createServer("server", "description"));
        const server = getAggregate(_event_store)(serverId("server"));
        expect(isSome(server)).toBeTruthy();
    });

    it("should retrieve a single aggregate", () => {
        let _event_store = memoryEventStore();
        appendCommand(_event_store)(createServer("server", "description"));
        const servers = getAggregates(_event_store)(AggregateType.Server);
        expect(servers).toHaveLength(1);
    });

})