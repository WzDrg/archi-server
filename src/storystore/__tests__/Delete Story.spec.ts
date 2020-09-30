import { bimap, chain, map, fromOption } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/pipeable";
import { head} from "fp-ts/lib/Array";

import { NewStory } from "../../core";
import { memoryStoryStore } from "../MemoryStoryStore";
import { Fault } from "../../core/Fault";

describe("Delete Story", () => {
  it("should delete a single story", () => {
    const newStory: NewStory = {
      name: "Story",
      context: "Story",
      description: "Description",
      date: new Date()
    };
    const store = memoryStoryStore([newStory]);
    pipe(
      store.getAllStories(),
      map(head),
      chain(fromOption(() => Fault.StoryStorageError)),
      chain(story=>store.deleteStory(story.id)),
      bimap(
        _ => fail(),
        deletedStory => {
          expect(deletedStory).toBeDefined()
        } 
      )
    );
  });

});