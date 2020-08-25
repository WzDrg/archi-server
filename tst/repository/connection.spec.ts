import { none, isSome, some, toNullable } from "fp-ts/lib/Option";
import { createConnection, connectionId, Connection, updateConnection, mergeConnection } from "../../src/repository/connection";
import { containerId } from "../../src/repository/container";

describe("createConnection", () => {
    it("should create a connection", () => {
        const events = createConnection("connection", containerId("c1"), containerId("c2"))(none);
        expect(events).toHaveLength(1);
        const newState = events[0].apply(none);
        expect(isSome(newState)).toBeTruthy();
        const connection: Connection = {
            id: connectionId("connection"),
            source_id: containerId("c1"),
            target_id: containerId("c2")
        };
        expect(events[0].apply(some(connection))).toEqual(some(connection));
    });

    it("should not create events when the connection exists", () => {
        const events = createConnection("connection", containerId("c1"), containerId("c2"))(some({ id: connectionId("connection"), source_id: containerId("c1"), target_id: containerId("c2") }));
        expect(events).toHaveLength(0);
    });
});

describe("updateConnection", () => {
    it("should update an existing connection", () => {
        const connection: Connection = {
            id: connectionId("connection"),
            source_id: containerId("c1"),
            target_id: containerId("c2")
        };
        const events = updateConnection(connectionId("connection"), containerId("c1"), containerId("c3"))(some(connection));
        expect(events).toHaveLength(1);
        const newState = events[0].apply(some(connection));
        expect(isSome(newState)).toBeTruthy();
        expect(toNullable(newState)).toHaveProperty("target_id", containerId("c3"));
    });

    it("should not update if the connection does not exist", () => {
        const events = updateConnection(connectionId("connection"), containerId("c1"), containerId("c3"))(none);
        expect(events).toHaveLength(0);
    });
});

describe("mergeCoonnection", () => {
    it("should create a new connection", () => {
        const events = mergeConnection("connection", containerId("c1"), containerId("c2"))(none);
        expect(events).toHaveLength(1);
        const connection = events[0].apply(none);
        expect(isSome(connection)).toBeTruthy();
    });

    it("should update an existing connection", () => {
        const connection: Connection = {
            id: connectionId("connection"),
            source_id: containerId("c1"),
            target_id: containerId("c2")
        };
        const events = mergeConnection("connection", containerId("c1"), containerId("c3"))(some(connection));
        expect(events).toHaveLength(1);
        const newState = events[0].apply(some(connection));
        expect(isSome(newState)).toBeTruthy();
        expect(toNullable(newState)).toHaveProperty("target_id", containerId("c3"));
    });
});
