import { some, none, isSome, toNullable } from "fp-ts/lib/Option"
import { createConnectionInstance, connectionInstanceId, updateConnectionInstance, ConnectionInstance } from "../../src/core/aggregates/connection_instance";
import { containerInstanceId } from "../../src/core/aggregates/container_instance";

describe("createConnectionInstance", () => {
    it("should create a connection instance", () => {
        const events = createConnectionInstance("c", containerInstanceId("c1"), containerInstanceId("c2"))(none);
        expect(events).toHaveLength(1);
        const connection_instance = events[0].apply(none);
        expect(isSome(connection_instance)).toBeTruthy();
        expect(toNullable(connection_instance)).toHaveProperty("id", connectionInstanceId("c"));
    });

    it("should not create events when the connection instance exists", () => {
        const connection_instance: ConnectionInstance = {
            id: connectionInstanceId("c"),
            source_instance: containerInstanceId("c1"),
            target_instance: containerInstanceId("c2")
        }
        const events = createConnectionInstance("c", containerInstanceId("c1"), containerInstanceId("c2"))(some(connection_instance));
        expect(events).toHaveLength(0);
    });
});

describe("updateConnectionInstance", () => {
    it("should update an existing instance", () => {
        const connection_instance: ConnectionInstance = {
            id: connectionInstanceId("c"),
            source_instance: containerInstanceId("c1"),
            target_instance: containerInstanceId("c2")
        }
        const events = updateConnectionInstance(connectionInstanceId("c"))(some(connection_instance));
        expect(events).toHaveLength(1);
    });

    it("should not create events when the connection instance does not exist", () => {
        const events = updateConnectionInstance(connectionInstanceId("c"))(none);
        expect(events).toHaveLength(0);
    })
});