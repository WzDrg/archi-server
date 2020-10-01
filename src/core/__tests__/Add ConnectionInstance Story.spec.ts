import { some, none, isSome, toNullable } from "fp-ts/lib/Option"
import { createConnectionInstance, updateConnectionInstance} from "../network/command/ConnectionInstanceCommand";
import { ConnectionInstance} from "../network/aggregate/Aggregates";
import { connectionInstanceId, containerInstanceId } from "../network/aggregate/AggregateId";

describe("createConnectionInstance", () => {
    it("should create a connection instance", () => {
        const events = createConnectionInstance("c", containerInstanceId("c1"), containerInstanceId("c2"))(none);
        expect(events).toHaveLength(1);
        const connectionInstance = events[0].apply(none);
        expect(isSome(connectionInstance)).toBeTruthy();
        expect(toNullable(connectionInstance)).toHaveProperty("id", connectionInstanceId("c"));
    });

    it("should not create events when the connection instance exists", () => {
        const connectionInstance: ConnectionInstance = {
            id: connectionInstanceId("c"),
            source_instance: containerInstanceId("c1"),
            target_instance: containerInstanceId("c2")
        }
        const events = createConnectionInstance("c", containerInstanceId("c1"), containerInstanceId("c2"))(some(connectionInstance));
        expect(events).toHaveLength(0);
    });
});

describe("updateConnectionInstance", () => {
    it("should update an existing instance", () => {
        const connectionInstance: ConnectionInstance = {
            id: connectionInstanceId("c"),
            source_instance: containerInstanceId("c1"),
            target_instance: containerInstanceId("c2")
        }
        const events = updateConnectionInstance(connectionInstanceId("c"))(some(connectionInstance));
        expect(events).toHaveLength(1);
    });

    it("should not create events when the connection instance does not exist", () => {
        const events = updateConnectionInstance(connectionInstanceId("c"))(none);
        expect(events).toHaveLength(0);
    })
});
