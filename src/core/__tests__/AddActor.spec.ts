import { createActor, actorId, updateActor, Actor, mergeActor } from "../aggregates/Actor";
import { memoryEventStore } from "../../eventstore/MemoryEventStore";
import { appendCommand, appendCommands } from "../CommandServices";
import { getAggregates } from "../AggregateServices";
import { AggregateType } from "../aggregates/types";

describe("AddActor", () => {
    it("should create a actor", () => {
        const event_store = appendCommand(memoryEventStore())(createActor("Engage One Designer", "My actor"));
        const result = getAggregates(event_store)(AggregateType.Actor);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("name", "Engage One Designer");
        expect(result[0]).toHaveProperty("description", "My actor")
    });

    it("should not execute two times same command", () => {
        const create_actor = createActor("Engage One Designer", "My actor");
        const event_store = appendCommands(memoryEventStore())([create_actor, create_actor]);
        const result = getAggregates(event_store)(AggregateType.Actor);
        expect(result).toHaveLength(1);
    });

    it("should update an existing actor", () => {
        const create_actor = createActor("Engage One Designer", "My actor");
        const update_actor = updateActor(create_actor.id, "new description");
        const event_store = appendCommands(memoryEventStore())([create_actor, update_actor]);
        const result = getAggregates(event_store)(AggregateType.Actor);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("description", "new description")
    });

    it("should create no events when the actor does not exist", () => {
        const update_actor = updateActor(actorId("new actor"), "new description");
        const event_store = appendCommands(memoryEventStore())([update_actor]);
        const result = getAggregates(event_store)(AggregateType.Actor);
        expect(result).toHaveLength(0);
    });

    it("should merge into a new actor", () => {
        const event_store = appendCommand(memoryEventStore())(mergeActor("Engage One Designer", "My actor"));
        const result = getAggregates(event_store)(AggregateType.Actor);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("name", "Engage One Designer");
        expect(result[0]).toHaveProperty("description", "My actor")
    });

    it("should merge into an updated actor", () => {
        const createActorCmd = createActor("Engage One Designer", "My actor");
        const mergeActorCmd = mergeActor("Engage One Designer", "new description");
        const eventStore = appendCommands(memoryEventStore())([createActorCmd, mergeActorCmd]);
        const result = getAggregates(eventStore)(AggregateType.Actor);
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("description", "new description")
    });

})
