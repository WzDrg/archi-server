import { bimap } from "fp-ts/lib/Either";
import { NewStory, StorySelection } from "../../core";
import { memoryStoryStore } from "../MemoryStoryStorage";

describe("Get Stories", () => {
  it("should limit the stories using the until selection", () => {
    const story: NewStory = {
      name: "story",
      context: "",
      description: "Description of story",
      date: new Date(2020,1,10)
    };
    const selection: StorySelection = {
      until: new Date(2020,1,11)
    }
    const store = memoryStoryStore([story]);
    bimap(
      _ => fail(),
      result => {
        expect(result).toHaveLength(1);
      }
    )(store.getStories(selection));
  });

  it("should not limit story that is equal to until", () => {
    const story: NewStory = {
      name: "story",
      context: "",
      description: "Description of story",
      date: new Date(2020,1,11)
    };
    const selection: StorySelection = {
      until: new Date(2020,1,11)
    }
    const store = memoryStoryStore([story]);
    bimap(
      _ => fail(),
      result => {
        expect(result).toHaveLength(1);
      }
    )(store.getStories(selection));
  });

  it("should not include story after until date", () => {
    const story: NewStory = {
      name: "story",
      context: "",
      description: "Description of story",
      date: new Date(2020,1,12)
    };
    const selection: StorySelection = {
      until: new Date(2020,1,11)
    }
    const store = memoryStoryStore([story]);
    bimap(
      _ => fail(),
      result => {
        expect(result).toHaveLength(0);
      }
    )(store.getStories(selection));
  });
})