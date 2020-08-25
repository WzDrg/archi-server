import { Story } from "./Story";

export type GetStoryCount = () => number;
export type AddStory = (story: Story) => boolean;

const getStoryCount = (): GetStoryCount =>
    () =>
        0;

const addStory = (): AddStory =>
    (story: Story) =>
        true;

export interface StoryServices {
    get_story_count: GetStoryCount;
    add_story: AddStory;
}

export const storyServices = () =>
    ({
        get_story_count: getStoryCount(),
        add_story: addStory()
    })