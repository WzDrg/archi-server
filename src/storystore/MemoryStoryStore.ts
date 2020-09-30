import { right } from "fp-ts/lib/Either";
import { v4 as uuidv4 } from "uuid";

import { Story, StoryId, StoryStore, AddStoryToStore, NewStory } from "../core/proxy/StoryStore";
import { none } from "fp-ts/lib/Option";

type StoryCache = Map<StoryId, Story>;

const addStory = (storiesCache: StoryCache) =>
    (newStory: NewStory) => {
        const story = { id: uuidv4(), ...newStory };
        storiesCache[story.id] = story;
        return right(story);
    }

const updateStory = (storiesCache: StoryCache) =>
    (storyId: StoryId, story: Story) =>
        right(story);

const deleteStory = (storiesCache: StoryCache) =>
    (storyId: StoryId) =>
        right(storyId);

const getStory = (storiesCache: StoryCache) =>
    (storyId: StoryId) =>
        right(none);

const getAllStories = (storiesCache: StoryCache) =>
    () =>
        right(Object.values(storiesCache));

export const memoryStoryStore = (stories: Story[]): StoryStore => {
    const cache = new Map<StoryId, Story>();
    stories.forEach(addStory(cache));
    return {
        addStory: addStory(cache),
        updateStory: updateStory(cache),
        deleteStory: deleteStory(cache),
        getStory: getStory(cache),
        getAllStories: getAllStories(cache)
    };
};
