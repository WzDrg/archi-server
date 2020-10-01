import { Either } from "fp-ts/lib/Either";

import { StoryStorage } from "./proxy/StoryStorage";
import { Story } from "./story/Story";
import { Fault } from "./Fault";


export type GetAllStories = () => Either<Fault, Story[]>;
export type AddStory = (story: Story) => Either<Fault, Story>;
export interface StoryServices {
    getAllStories: GetAllStories;
    addStory: AddStory;
}


const getAllStories = (storyStore: StoryStorage) =>
    storyStore.getAllStories;

const addStory = (storyStore: StoryStorage) =>
    storyStore.addStory;

export const storyServices = (storyStore: StoryStorage): StoryServices =>
    ({
        getAllStories: getAllStories(storyStore),
        addStory: addStory(storyStore)
    });
