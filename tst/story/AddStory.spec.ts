import { Story } from "../../src/story/story";
import { storyServices } from "../../src/story/StoryServices";

describe("AddStory", () => {
    it("should add a new story", () => {
        let story: Story = {
            context: "context",
            date: new Date(),
            description: "Test story"
        };
        const story_services = storyServices();
        const result = story_services.add_story(story);
        expect(result).toBeTruthy();
    });

});