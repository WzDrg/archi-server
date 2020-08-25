import { none, isSome, some, toNullable } from "fp-ts/lib/Option";
import { createServer, updateServer, mergeServer, serverId } from "../../src/repository/server";

describe("createServer", () => {
    it("should create a server created event", () => {
        const events = createServer("hn005", "")(none);
        expect(events).toHaveLength(1);
        const server = events[0].apply(none);
        expect(isSome(server)).toBeTruthy();
    });

    it("should not create an event when the server already exists", () => {
        const events = createServer("hn005", "")(some({
            id: serverId("hn005"),
            name: "",
            description: ""
        }));
        expect(events).toHaveLength(0);
    });
});

describe("updateServer", () => {
    it("should create an event when the server exists", () => {
        const events = updateServer("hn005", "Updated")(some({
            id: serverId("hn005"),
            name: "hn005",
            description: "Created"
        }));
        expect(events).toHaveLength(1);
    });

    it("should not create an event when the server does not exist", () => {
        const events = updateServer("hn005", "")(none);
        expect(events).toHaveLength(0);
    })
});

describe("mergeServer", () => {
    it("should create a new server if the server does not exist", () => {
        const events = mergeServer("hn005")(none);
        expect(events).toHaveLength(1);
        const server = events[0].apply(none);
        expect(isSome(server)).toBeTruthy();
    });

    it("should update an existing server", () => {
        const old_server = {
            id: serverId("hn005"),
            name: "hn005",
            description: "Created"
        };
        const events = mergeServer("hn005")(some(old_server));
        expect(events).toHaveLength(1);
        const new_server = events[0].apply(some(old_server));
        expect(isSome(new_server)).toBeTruthy();
        expect(toNullable(new_server)).toHaveProperty("name", old_server.name);
        expect(toNullable(new_server)).toHaveProperty("description", old_server.description);
    });
});