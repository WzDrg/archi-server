import { none, isSome, some } from "fp-ts/lib/Option";
import { createContainerInstance, containerInstanceId, mergeContainerInstance } from "../../src/repository/aggregates/container_instance";
import { serverId } from "../../src/repository/aggregates/server";

describe("createContainerInstance", () => {
    it("should create a new deployed container", () => {
        const events = createContainerInstance("hn005_java", "hn005")(none);
        expect(events).toHaveLength(1);
        const deployed_container = events[0].apply(none);
        expect(isSome(deployed_container)).toBeTruthy();
    });

    it("should not create events when the container exists", () => {
        const events = createContainerInstance("hn005_java", "hn005")(some({
            id: containerInstanceId("java"),
            server_id: serverId("hn005")
        }));
        expect(events).toHaveLength(0);
    });
});

describe("updateContainerInstance", () => {

});

describe("mergeContainerInstance", () => {
    it("should create a new deployed container", () => {
        const events = mergeContainerInstance("hn005_java", "hn005")(none);
        expect(events).toHaveLength(1);
        const deployed_container = events[0].apply(none);
        expect(isSome(deployed_container)).toBeTruthy();
    });
});