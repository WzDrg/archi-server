import { none, isSome, toNullable, some } from "fp-ts/lib/Option";
import { createContainer, containerId, updateContainer, Container, mergeContainer } from "../../src/core/aggregates/container";
import { softwareSystemId } from "../../src/core/aggregates/software_system";

describe("createContainer", () => {
    it("should create a container", () => {
        const events = createContainer("Engage One Designer", "My container", softwareSystemId("system"))(none);
        expect(events).toHaveLength(1);
        const container = events[0].apply(none);
        expect(isSome(container)).toBeTruthy();
        expect(toNullable(container)).toHaveProperty("name", "Engage One Designer");
    })

    it("should not create an event when the container exists", () => {
        const events = createContainer("Engage One Designer", "My container", softwareSystemId("system"))(some({ id: containerId("container"), name: "container", description: "My container" }));
        expect(events).toHaveLength(0);
    });
});

describe("updateContainer", () => {
    it("should update an existing container", () => {
        const container: Container = {
            id: containerId("container"),
            name: "container",
            description: "container",
            software_system: softwareSystemId("system")
        };
        const events = updateContainer(containerId("container"), "new description")(some(container));
        expect(events).toHaveLength(1);
        expect(events[0].apply(none)).toEqual(none);
        const newContainer = events[0].apply(some(container));
        expect(isSome(newContainer)).toBeTruthy();
    });

    it("should create no events when the container does not exist", () => {
        let events = updateContainer(containerId("container"), "description")(none);
        expect(events).toHaveLength(0);
    });
});

describe("mergeContainer", () => {
    it("should create a new container", () => {
        const events = mergeContainer("Engage One Designer", "My container", softwareSystemId("system"))(none);
        expect(events).toHaveLength(1);
        const container = events[0].apply(none);
        expect(isSome(container)).toBeTruthy();
        expect(toNullable(container)).toHaveProperty("name", "Engage One Designer");
    });
})