import { pipe } from "fp-ts/lib/pipeable";
import { map } from "fp-ts/lib/Array";
import { map as mapEither } from "fp-ts/lib/Either";

import { Story, GetAllStories } from "../../core/index";

const toGQLStory = (story: Story) =>
    ({
        name: story.name
    });

export const queryAllStories = (getAllStories: GetAllStories) =>
    () =>
        pipe(
            getAllStories(),
            mapEither(map(toGQLStory))
        )
