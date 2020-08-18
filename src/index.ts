
import { startServer, ServerConfiguration } from './graphql/GraphQLServer';
import { memoryEventStore } from './eventstore/memory_event_store';
import { services } from './core/service';
import { processStory, processStoriesOfFolder } from './story/story_merger';

let event_store = memoryEventStore();
let core_services = services(event_store);
processStoriesOfFolder(core_services)("./src/resources");

const config: ServerConfiguration = {
  introspection: true,
  playground: true,
}

startServer(config, core_services);