import { head } from "fp-ts/lib/Array";
import { bimap, chain, fromOption, map } from "fp-ts/lib/Either";
import { isSome, toNullable } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { NewStory } from "../../core";
import { Fault } from "../../core/Fault";
import { memoryStoryStore } from "../MemoryStoryStorage";

describe("Get Story", () => {
  it("should retrieve a story", () => {
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
      chain(story => store.getStory(story.id)),
      bimap(
        _ => fail(),
        _story => {
          expect(isSome(_story)).toBeTruthy();
          expect(toNullable(_story)).toHaveProperty("name", "story");
        }
      )
    )
  })
  
});