import { startServer, ServerConfiguration } from './graphql/GraphQLServer';
import { memoryEventStore } from './repository/MemoryEventStore';
import { readStoriesFromFolder } from './story/StoryReader';
import { pipe } from 'fp-ts/lib/pipeable';
import { appendStoriesToEventStore } from "./session/StoryAppender";

let event_store = pipe(
  readStoriesFromFolder("./src/resources"),
  appendStoriesToEventStore(memoryEventStore())
);

const config: ServerConfiguration = {
  introspection: true,
  playground: true,
}

startServer(event_store);