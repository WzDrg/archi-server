import { Either } from "fp-ts/lib/Either";
import { Option } from "fp-ts/lib/Option";

import { Fault } from "../Fault";
import { NewStory, Story, StoryId } from "../story/Story";

export type AddStoryToStorage = (story: NewStory) => Either<Fault, Story>;

export type UpdateStoryFromStorage = (story: Story) => Either<Fault, Story>;

export type DeleteStoryFromStorage = (storyId: StoryId) => Either<Fault, StoryId>;

export type GetStoryFromStorage = (storyId: StoryId) => Either<Fault, Option<Story>>;

export type GetAllStoriesFromStorage = () => Either<Fault, Story[]>;

export interface StoryStorage {
    addStory: AddStoryToStorage;
    updateStory: UpdateStoryFromStorage;
    deleteStory: DeleteStoryFromStorage;
    getStory: GetStoryFromStorage;
    getAllStories: GetAllStoriesFromStorage;
}
