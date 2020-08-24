import { isSome } from "fp-ts/lib/Option";
import { repositoryServices } from "../../src/repository/service";
import { memoryEventStore } from "../../src/eventstore/memory_event_store";
import { AggregateType } from "../../src/repository/types";
import { createServer, serverId } from "../../src/repository/aggregates/server";

describe("execute_commands", () => {
    it("should store the events", () => {
        let _event_store = memoryEventStore();
        repositoryServices(_event_store).execute_command(createServer("server", "description"));
        const events = _event_store.get_events_of_type(AggregateType.Server);
        expect(events).toHaveLength(1);
    });
})

describe("getAggregate", () => {

    it("should retrieve a single aggregate", () => {
        let _event_store = memoryEventStore();
        repositoryServices(_event_store).execute_command(createServer("server", "description"));
        const server = repositoryServices(_event_store).get_aggregate(serverId("server"));
        expect(isSome(server)).toBeTruthy();
    });
});

describe("getAggregates", () => {
    it("should retrieve a single aggregate", () => {
        let _event_store = memoryEventStore();
        repositoryServices(_event_store).execute_command(createServer("server", "description"));
        const servers = repositoryServices(_event_store).get_aggregates(AggregateType.Server);
        expect(servers).toHaveLength(1);
    });

})