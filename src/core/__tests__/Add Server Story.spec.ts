import { right, fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

import { AggregateType } from "../network/aggregate/AggregateType";
import { aggregateServices } from "../AggregateServices";
import { Story } from "../story/Story";


const storyStore = {
    addStory: jest.fn(),
    updateStory: jest.fn(),
    deleteStory: jest.fn(),
    getStory: jest.fn(),
    getAllStories: jest.fn(),
    getStories: jest.fn()
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
        storyStore.getStories.mockReturnValueOnce(right([story]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType({ until: new Date() })(AggregateType.Server),
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
        storyStore.getStories.mockReturnValue(right([story]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType({ until: new Date() })(AggregateType.Server),
            fold(
                () => fail("should not have fault"),
                servers => {
                    expect(servers).toHaveLength(2);
                }));
    });
});
