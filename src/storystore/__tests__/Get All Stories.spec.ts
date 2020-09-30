import { bimap } from "fp-ts/lib/Either";
import { NewStory } from "../../core";
import { memoryStoryStore } from "../MemoryStoryStore";

describe("Get All Stories", () => {
  it("should return an empty list when stories are available", async () => {
    const store = memoryStoryStore([]);
    bimap(
      _ => fail(),
      result => {
        expect(result).toHaveLength(0);
      }
    )(store.getAllStories());
  });

  it("should return a single story", async () => {
    const story: NewStory = {
      name: "story",
      context: "",
      description: "Description of story",
      date: new Date()
    };
    const store = memoryStoryStore([story]);
    bimap(
      _ => fail(),
      result => {
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty("id");
        expect(result[0]).toHaveProperty("name", story.name);
        expect(result[0]).toHaveProperty("context", story.context);
      }
    )(store.getAllStories());
  });

  
});