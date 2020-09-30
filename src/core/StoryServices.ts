import { StoryStore } from "./proxy/StoryStore";
import { Story } from "./model/Story";
import { Fault } from "./Fault";
import { Either } from "fp-ts/lib/Either";


const getAllStories = (storyStore: StoryStore) =>
    storyStore.getAllStories;

const addStory = (storyStore: StoryStore) =>
    storyStore.addStory;

export type GetAllStories = () => Either<Fault, Story[]>;
export type AddStory = (story: Story) => Either<Fault, Story>;
export interface StoryServices {
    getAllStories: GetAllStories;
    addStory: (story: Story) => Either<Fault, Story>
}

export const storyServices = (storyStore: StoryStore): StoryServices =>
    ({
        getAllStories: getAllStories(storyStore),
        addStory: addStory(storyStore)
    });
