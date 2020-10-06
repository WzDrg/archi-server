import { bimap } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { right } from "fp-ts/lib/These";
import { NewStory } from "../story/Story";
import { storyServices } from "../StoryServices";

const storage = {
    addStory: jest.fn(),
    deleteStory: jest.fn(),
    getAllStories: jest.fn(),
    getStory: jest.fn(),
    updateStory: jest.fn(),
    getStories: jest.fn()
}

describe("Add Story", () => {
    it("should add a new story", async () => {
        const story: NewStory = {
            context: "context",
            date: new Date(),
            name: "story",
            description: "description of story"
        };
        storage.addStory.mockReturnValueOnce(right({ ...story, id: "storyid" }));
        const services = storyServices(storage);
        pipe(
            services.addStory(story),
            bimap(
                _ => fail(),
                result => {
                    expect(result).toBeDefined()
                })
        );
    });
});
