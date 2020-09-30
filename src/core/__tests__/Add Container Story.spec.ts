import { right, fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";

import { AggregateType } from "../model/types";
import { aggregateServices } from "../AggregateServices";
import { Story } from "../model/Story";


const storyStore = {
    addStory: jest.fn(),
    updateStory: jest.fn(),
    deleteStory: jest.fn(),
    getStory: jest.fn(),
    getAllStories: jest.fn()
}

describe("Container", () => {
    it("should create a new container", () => {
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
                        }
                    }
                }
            }
        }
        storyStore.getAllStories.mockReturnValueOnce(right([story]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType(AggregateType.Container),
            fold(
                () => fail("should not have fault"),
                containers => {
                    expect(containers).toHaveLength(1);
                }));
    });

    it("should update an existing container", () => {
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
                        }
                    }
                }
            }
        }
        const story2: Story = {
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
                            description: "Updated Description",
                            type: "Application",
                        }
                    }
                }
            }
        }
        storyStore.getAllStories.mockReturnValueOnce(right([story, story2]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType(AggregateType.Container),
            fold(
                () => fail("should not have fault"),
                containers => {
                    expect(containers).toHaveLength(1);
                    expect(containers[0]).toHaveProperty("description", story2.softwareSystems.softwareSystem.containers.container1.description);
                }));
    });
});
