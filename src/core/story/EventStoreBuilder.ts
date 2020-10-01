import { reduce } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";

import { EventStore } from "../network/event/EventStorage";
import { executeCommand } from "../network/command/CommandExecution";
import { AggregateId, containerInstanceId, containerId, softwareSystemId } from "../network/aggregate/AggregateId";
import { Command } from "../network/command/Command";
import { AggregateType } from "../network/aggregate/AggregateType";
import { mergeConnectionInstance } from "../network/command/ConnectionInstanceCommand";
import { mergeContainerInstance } from "../network/command/ContainerInstanceCommand";
import { mergeConnection } from "../network/command/ConnectionCommand";
import { memoryEventStore } from "../network/event/EventStorage";
import { Story, StoryContainer, StoryContainerInstance, StoryServer, StorySoftwareSystem, StoryUses, StoryCommunication, StoryEnvironment } from "./Story";
import { mergeServer } from "../network/command/ServerCommand";
import { mergeContainer } from "../network/command/ContainerCommand";
import { mergeSoftwareSystem } from "../network/command/SoftwareSystemCommand";

const toTargetInstanceId = (id: string, type?: string): AggregateId<any> =>
    ({ id: id, type: type ? AggregateType[type] : AggregateType.ContainerInstance });


const fromContainerinstanceUses = (container_instance_name: string, name: string, communication: StoryCommunication): Command<any>[] =>
    [mergeConnectionInstance(name, containerInstanceId(container_instance_name), toTargetInstanceId(name, communication.type))];


const fromContainerInstance = (server_name: string, name: string, container: StoryContainerInstance): Command<any>[] =>
    [container.container
        ? mergeContainerInstance(`${server_name}_${name}`, server_name, containerId(container.container))
        : mergeContainerInstance(`${server_name}_${name}`, server_name),
    ...container.uses
        ? reduce([], (commands: Command<any>[], uses_name: string) =>
            commands.concat(fromContainerinstanceUses(`${server_name}_${name}`, uses_name, container.uses[uses_name])))
            (Object.keys(container.uses))
        : []];


const fromServer = (environment: string, name: string, server: StoryServer): Command<any>[] =>
    [mergeServer(name, server.description, environment, server.os, server.tier, server.datacenter, server.cpu, server.memory),
    ...server.containers
        ? reduce([], (commands: Command<any>[], container_name: string) =>
            commands.concat(fromContainerInstance(name, container_name, server.containers[container_name])))
            (Object.keys(server.containers))
        : []];


const fromEnvironment = (name: string, environment: StoryEnvironment): Command<any>[] =>
    environment.servers
        ? reduce([], (commands: Command<any>[], server_name: string) =>
            commands.concat(fromServer(name, server_name, environment.servers[server_name])))
            (Object.keys(environment.servers))
        : [];


const fromContainerUses = (container_name: string, name: string, uses: StoryUses) =>
    [mergeConnection(`${container_name}_${name}`, containerId(container_name), { id: name, type: AggregateType[uses.type ?? "container"] })];


const fromContainer = (software_system_name: string, name: string, container: StoryContainer): Command<any>[] =>
    [mergeContainer(name, container.description, softwareSystemId(software_system_name)),
    ...container.uses
        ? reduce([], (commands: Command<any>[], uses_name: string) =>
            commands.concat(fromContainerUses(name, uses_name, container.uses[uses_name])))
            (Object.keys(container.uses))
        : []];


const fromSoftwareSystemUses = (software_system_name: string, name: string, uses: StoryUses) =>
    [mergeConnection(`${software_system_name}_${name}`, softwareSystemId(software_system_name), { id: name, type: AggregateType[uses.type ?? "container"] })];


const fromSoftwareSystem = (name: string, softwareSystem: StorySoftwareSystem): Command<any>[] =>
    [mergeSoftwareSystem(name, softwareSystem.description ?? ""),
    ...softwareSystem.containers
        ? reduce([], (commands: Command<any>[], container_name: string) =>
            commands.concat(fromContainer(name, container_name, softwareSystem.containers[container_name])))
            (Object.keys(softwareSystem.containers))
        : [],
    ...softwareSystem.uses
        ? reduce([], (commands: Command<any>[], uses_name: string) =>
            commands.concat(fromSoftwareSystemUses(name, uses_name, softwareSystem.uses[uses_name])))
            (Object.keys(softwareSystem.uses))
        : []];


const fromStory = (story: Story): Command<any>[] =>
    [...story.environments
        ? reduce([], (commands: Command<any>[], env: string) =>
            commands.concat(fromEnvironment(env, story.environments[env])))
            (Object.keys(story.environments))
        : [],
    ...story.softwareSystems
        ? reduce([], (commands: Command<any>[], name: string) =>
            commands.concat(fromSoftwareSystem(name, story.softwareSystems[name])))
            (Object.keys(story.softwareSystems))
        : []];

export const appendStoryToEventStore = (events: EventStore) =>
    (story: Story) =>
        pipe(
            fromStory(story),
            reduce(events, (events, command) => executeCommand(events)(command))
        );

export const eventStoreFromStories = (stories: Story[]) =>
    reduce(memoryEventStore(), (events: EventStore, story: Story) => appendStoryToEventStore(events)(story))(stories)

