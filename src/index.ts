import { pipe } from 'fp-ts/lib/pipeable';

import { startServer, ServerConfiguration } from './api/GraphQLServer';
import { readStoriesFromFolder } from './storystore/StoryReader';
import { aggregateServices } from './core/AggregateServices';
import { storyServices } from './core';
import { memoryStoryStore } from './storystore/MemoryStoryStore';

let storyStorage = pipe(
    readStoriesFromFolder("./src/resources"),
    memoryStoryStore
);

const config: ServerConfiguration = {
    introspection: true,
    playground: true,
    storyServices: storyServices(storyStorage),
    aggregateServices: aggregateServices(storyStorage)
}

startServer(config);
