import {bimap} from "fp-ts/lib/Either";
import { NewStory } from "../../core/story/Story";
import {memoryStoryStore} from "../MemoryStoryStore";

describe("Add story", () => {
    it("should add a new story", () => {
	let story: NewStory = {
	    name: "story",
	    context: "context",
	    date: new Date(),
	    description: "Test story"
	};
	const store = memoryStoryStore([]);
	bimap(
	    e=>fail(e),
	    result => {
		expect(result).toHaveProperty("id");
	    })(store.addStory(story));
    });
});
