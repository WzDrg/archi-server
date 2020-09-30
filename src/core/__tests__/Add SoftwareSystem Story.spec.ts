import { fold, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

import { Story } from "../proxy/StoryStore";
import { aggregateServices } from "../AggregateServices";
import { AggregateType } from "../aggregates/types";

const storyStore = {
    addStory: jest.fn(),
    updateStory: jest.fn(),
    deleteStory: jest.fn(),
    getStory: jest.fn(),
    getAllStories: jest.fn()
}

describe("createSoftwareSystem", () => {
    it("should create a new software system", () => {
        const story: Story = {
            id: "1",
            name: "New software system",
            description: "Description",
            date: new Date(),
            context: "Tests",
            softwareSystems: {
                "softwareSystem": {
                    description: "Description of software system",
                    containers: {}
                }
            }
        }
        storyStore.getAllStories.mockReturnValueOnce(right([story]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType(AggregateType.SoftwareSystem),
            fold(
                () => fail("should not have fault"),
                softwareSystems => {
                    expect(softwareSystems).toHaveLength(1);
                    expect(softwareSystems[0]).toHaveProperty("name", "softwareSystem");
                    expect(softwareSystems[0]).toHaveProperty("description", story.softwareSystems.softwareSystem.description);
                }));
    });

    it("should create multiple software systems", () => {
        const story: Story = {
            id: "1",
            name: "New software system",
            description: "Description",
            date: new Date(),
            context: "Tests",
            softwareSystems: {
                "softwareSystem1": {
                    description: "Description of software system 1",
                    containers: {}
                },
                "softwareSystem2": {
                    description: "Description of software system 2",
                    containers: {}
                }
            }
        }
        storyStore.getAllStories.mockReturnValueOnce(right([story]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType(AggregateType.SoftwareSystem),
            fold(
                () => fail("should not have fault"),
                softwareSystems => {
                    expect(softwareSystems).toHaveLength(2);
                }));
    });

    it("should create multiple software systems", () => {
        const story: Story = {
            id: "1",
            name: "New software system",
            description: "Description",
            date: new Date(),
            context: "Tests",
            softwareSystems: {
                "softwareSystem1": {
                    description: "Description of software system 1",
                    containers: {}
                }
            }
        }
        const story2: Story = {
            id: "2",
            name: "New software system",
            description: "Description",
            date: new Date(),
            context: "Tests",
            softwareSystems: {
                "softwareSystem2": {
                    description: "Description of software system 2",
                    containers: {}
                }
            }
        }
        storyStore.getAllStories.mockReturnValueOnce(right([story, story2]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType(AggregateType.SoftwareSystem),
            fold(
                () => fail("should not have fault"),
                softwareSystems => {
                    expect(softwareSystems).toHaveLength(2);
                }));
    });

    it("should update an existing software system", () => {
        const story: Story = {
            id: "1",
            name: "New software system",
            description: "Description",
            date: new Date(),
            context: "Tests",
            softwareSystems: {
                "softwareSystem1": {
                    description: "Description of software system 1",
                    containers: {}
                }
            }
        }
        const story2: Story = {
            id: "2",
            name: "New software system",
            description: "Description",
            date: new Date(),
            context: "Tests",
            softwareSystems: {
                "softwareSystem1": {
                    description: "Updated description",
                    containers: {}
                }
            }
        }
        storyStore.getAllStories.mockReturnValueOnce(right([story, story2]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType(AggregateType.SoftwareSystem),
            fold(
                () => fail("should not have fault"),
                softwareSystems => {
                    expect(softwareSystems).toHaveLength(1);
                    expect(softwareSystems[0]).toHaveProperty("description", story2.softwareSystems.softwareSystem1.description);
                }));
    });
});
