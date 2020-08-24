import { none, isSome, toNullable, some } from "fp-ts/lib/Option";
import { createActor, actorId, updateActor, Actor, mergeActor } from "../../src/repository/aggregates/actor";

describe("createActor", () => {
    it("should create a actor", () => {
        const events = createActor("Engage One Designer", "My actor")(none);
        expect(events).toHaveLength(1);
        const actor = events[0].apply(none);
        expect(isSome(actor)).toBeTruthy();
        expect(toNullable(actor)).toHaveProperty("name", "Engage One Designer");
    })

    it("should not create an event when the actor exists", () => {
        const events = createActor("Engage One Designer", "My actor")(some({ id: actorId("actor"), name: "actor", description: "My actor" }));
        expect(events).toHaveLength(0);
    });
});

describe("updateActor", () => {
    it("should update an existing actor", () => {
        const actor: Actor = {
            id: actorId("actor"),
            name: "actor",
            description: "actor"
        };
        const events = updateActor(actorId("actor"), "new description")(some(actor));
        expect(events).toHaveLength(1);
        expect(events[0].apply(none)).toEqual(none);
        const newActor = events[0].apply(some(actor));
        expect(isSome(newActor)).toBeTruthy();
    });

    it("should create no events when the actor does not exist", () => {
        let events = updateActor(actorId("actor"), "description")(none);
        expect(events).toHaveLength(0);
    });
});

describe("mergeActor", () => {
    it("should create a new actor", () => {
        const events = mergeActor("Engage One Designer", "My actor")(none);
        expect(events).toHaveLength(1);
        const actor = events[0].apply(none);
        expect(isSome(actor)).toBeTruthy();
        expect(toNullable(actor)).toHaveProperty("name", "Engage One Designer");
    });
})