import { none, isSome, some, toNullable } from "fp-ts/lib/Option"
import { createSoftwareSystem, SoftwareSystem, softwareSystemId, updateSoftwareSystem, mergeSoftwareSystem } from "../../src/repository/software_system";

describe("createSoftwareSystem", () => {
    it("should create a new software system", () => {
        const events = createSoftwareSystem("name", "description")(none);
        expect(events).toHaveLength(1);
        const state = events[0].apply(none);
        expect(isSome(state)).toBeTruthy();
    });

    it("should create no events when the system exists", () => {
        const softwareSystem: SoftwareSystem = {
            id: softwareSystemId("name"),
            name: "name",
            description: "description"
        }
        const events = createSoftwareSystem("name", "description")(some(softwareSystem));
        expect(events).toHaveLength(0);
    });
});

describe("updateSoftwareSystem", () => {
    it("should update a new software system", () => {
        const id = softwareSystemId("name");
        const softwareSystem: SoftwareSystem = {
            id: id,
            name: "name",
            description: "description"
        }
        const events = updateSoftwareSystem(id, "new description")(some(softwareSystem));
        expect(events).toHaveLength(1);
        const newState = events[0].apply(some(softwareSystem));
        expect(isSome(newState)).toBeTruthy();
        expect(toNullable(newState)).toHaveProperty("description", "new description");
    });
});

describe("mergeSoftwareSystem", () => {
    it("should create a new when the state does not exist", () => {
        const events = mergeSoftwareSystem("name", "description")(none);
        expect(events).toHaveLength(1);
        const state = events[0].apply(none);
        expect(isSome(state)).toBeTruthy();
    });
    it("should update when the state does not exist", () => {
        const id = softwareSystemId("name");
        const softwareSystem: SoftwareSystem = {
            id: id,
            name: "name",
            description: "description"
        }
        const events = mergeSoftwareSystem("name", "description")(some(softwareSystem));
        expect(events).toHaveLength(1);
        const state = events[0].apply(some(softwareSystem));
        expect(isSome(state)).toBeTruthy();
    });
});