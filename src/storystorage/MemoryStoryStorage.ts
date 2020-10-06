import { map, right } from "fp-ts/lib/Either";
import { v4 as uuidv4 } from "uuid";

import { Story, StoryId, StoryStorage, NewStory, StorySelection } from "../core/index";
import { fromNullable, none } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { filter } from "fp-ts/lib/Array";

type StoryCache = Map<StoryId, Story>;

const addStory = (storiesCache: StoryCache) =>
    (newStory: NewStory) => {
        const story = { id: uuidv4(), ...newStory };
        storiesCache[story.id] = story;
        return right(story);
    }

const updateStory = (storiesCache: StoryCache) =>
    (story: Story) => {
        storiesCache[story.id] = story;
        return right(story);
    }

const deleteStory = (storiesCache: StoryCache) =>
    (storyId: StoryId) =>
        right(storyId);

const getStory = (storiesCache: StoryCache) =>
    (storyId: StoryId) =>
        right(fromNullable(storiesCache[storyId]));

const getAllStories = (storiesCache: StoryCache) =>
    () =>
        right(Object.values(storiesCache));

const filterStory = (selection: StorySelection) =>
    (story: Story) =>
        story.date <= selection.until;

const getStories = (storiesCache: StoryCache) =>
    (selection: StorySelection) =>
        pipe(
            right(Object.values(storiesCache)),
            map(filter(filterStory(selection)))
        );

export const memoryStoryStore = (stories: NewStory[]): StoryStorage => {
    const cache = new Map<StoryId, Story>();
    stories.forEach(addStory(cache));
    return {
        addStory: addStory(cache),
        updateStory: updateStory(cache),
        deleteStory: deleteStory(cache),
        getStory: getStory(cache),
        getAllStories: getAllStories(cache),
        getStories: getStories(cache)
    };
};
