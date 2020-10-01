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
    getAllStories: jest.fn()
}

describe("Connection", () => {
    it("should create a new connection", () => {
        const story: Story = {
            id: "1",
            name: "Connection",
            description: "Description",
            date: new Date(),
            context: "Tests",
            softwareSystems: {
                "softwareSystem": {
                    description: "Description of software system",
                    containers: {
                        container1: {
                            description: "Description",
                            type: "Application",
                            uses: {
                                container2: {
                                    type: "Container"
                                }
                            }
                        },
                        container2: {
                            description: "Description",
                            type: "Application"
                        }
                    }
                }
            }
        }
        storyStore.getAllStories.mockReturnValueOnce(right([story]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType(AggregateType.Connection),
            fold(
                () => fail("should not have fault"),
                connections => {
                    expect(connections).toHaveLength(1);
                }));
    });
});
