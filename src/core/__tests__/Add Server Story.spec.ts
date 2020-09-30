import { right, fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

import { AggregateType } from "../aggregates/types";
import { aggregateServices } from "../AggregateServices";
import { Story } from "../proxy/StoryStore";


const storyStore = {
    addStory: jest.fn(),
    updateStory: jest.fn(),
    deleteStory: jest.fn(),
    getStory: jest.fn(),
    getAllStories: jest.fn()
}

describe("Add Server Story", () => {
    it("should create a new server", () => {
        const story: Story = {
            id: "1",
            name: "Connection",
            description: "Description",
            date: new Date(),
            context: "Tests",
            environments: {
                "TST": {
                    servers: {
                        "hn1248": {
                        }
                    }
                }
            }
        }
        storyStore.getAllStories.mockReturnValueOnce(right([story]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType(AggregateType.Server),
            fold(
                () => fail("should not have fault"),
                servers => {
                    expect(servers).toHaveLength(1);
                    expect(servers[0]).toHaveProperty("name", "hn1248");
                }));
    });

    it("should create two server", () => {
        const story: Story = {
            id: "1",
            name: "Connection",
            description: "Description",
            date: new Date(),
            context: "Tests",
            environments: {
                "TST": {
                    servers: {
                        "hn1248": {},
                        "hn1250": {},
                    }
                }
            }
        }
        storyStore.getAllStories.mockReturnValueOnce(right([story]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType(AggregateType.Server),
            fold(
                () => fail("should not have fault"),
                servers => {
                    expect(servers).toHaveLength(2);
                }));
    });
});
