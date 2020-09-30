import { Either } from "fp-ts/lib/Either";
import { Option } from "fp-ts/lib/Option";

import { Fault } from "../Fault";
import { NewStory, Story, StoryId } from "../story/Story";

export type AddStoryToStore = (story: NewStory) => Either<Fault, Story>;

export type UpdateStoryFromStore = (story: Story) => Either<Fault, Story>;

export type DeleteStoryFromStore = (storyId: StoryId) => Either<Fault, StoryId>;

export type GetStoryFromStore = (storyId: StoryId) => Either<Fault, Option<Story>>;

export type GetAllStoriesFromStore = () => Either<Fault, Story[]>;

export interface StoryStore {
    addStory: AddStoryToStore;
    updateStory: UpdateStoryFromStore;
    deleteStory: DeleteStoryFromStore;
    getStory: GetStoryFromStore;
    getAllStories: GetAllStoriesFromStore;
}
