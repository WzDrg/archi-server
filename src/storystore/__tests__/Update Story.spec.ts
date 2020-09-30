import { head } from "fp-ts/lib/Array";
import { bimap, chain, fromOption, map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { isSome, toNullable } from "fp-ts/lib/Option";
import { NewStory } from "../../core";
import { Fault } from "../../core/Fault";
import { memoryStoryStore } from "../MemoryStoryStore";

describe("Update Story", () => {
  it("should return updated story", () => {
    const story: NewStory = {
      name: "story",
      context: "story",
      date: new Date(),
      description: "New story"
    };
    const store = memoryStoryStore([story]);
    pipe(
      store.getAllStories(),
      map(head),
      chain(fromOption(() => Fault.StoryStorageError)),
      chain(story => store.updateStory({ ...story, name: "Updated story" })),
      bimap(
        _ => fail(),
        updatedStory => {
          expect(updatedStory).toHaveProperty("name", "Updated story");
        }
      )
    )
  });
  it("should contain updated story", () => {
    const story: NewStory = {
      name: "story",
      context: "story",
      date: new Date(),
      description: "New story"
    };
    const store = memoryStoryStore([story]);
    pipe(
      store.getAllStories(),
      map(head),
      chain(fromOption(() => Fault.StoryStorageError)),
      chain(story => store.updateStory({ ...story, name: "Updated story" })),
      chain(story => store.getStory(story.id)),
      bimap(
        _ => fail(),
        updatedStory => {
          expect(isSome(updatedStory)).toBeTruthy();
          expect(toNullable(updatedStory)).toHaveProperty("name", "Updated story");
        }
      )
    )
  });
});