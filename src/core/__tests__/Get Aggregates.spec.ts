import { fold, right, chain, map, fromOption } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";

import { Story } from "../story/Story";
import { aggregateServices } from "../AggregateServices";
import { AggregateType } from "../network/aggregate/AggregateType";
import { isSome, toNullable } from "fp-ts/lib/Option";

const storyStore = {
    addStory: jest.fn(),
    updateStory: jest.fn(),
    deleteStory: jest.fn(),
    getStory: jest.fn(),
    getAllStories: jest.fn(),
    getStories:jest.fn()
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
        storyStore.getStories.mockReturnValue(right([story]));
        pipe(
            aggregateServices(storyStore).getAggregatesOfType({ until: new Date() })(AggregateType.SoftwareSystem),
            chain(softwareSystems => aggregateServices(storyStore).getAggregateWithId({until: new Date()})(softwareSystems[0].id)),
            fold(
                () => fail("should not have fault"),
                softwareSystem => {
                    expect(isSome(softwareSystem)).toBeTruthy();
                    expect(toNullable(softwareSystem)).toHaveProperty("description", story.softwareSystems.softwareSystem.description);
                }));
    });
});
