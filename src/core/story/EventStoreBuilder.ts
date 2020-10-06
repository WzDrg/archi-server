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


const fromContainerinstanceUses = (date: Date, container_instance_name: string, name: string, communication: StoryCommunication): Command<any>[] =>
    [mergeConnectionInstance(name, date, containerInstanceId(container_instance_name), toTargetInstanceId(name, communication.type))];


const fromContainerInstance = (date: Date, server_name: string, name: string, container: StoryContainerInstance): Command<any>[] =>
    [container.container
        ? mergeContainerInstance(`${server_name}_${name}`, date, server_name, containerId(container.container))
        : mergeContainerInstance(`${server_name}_${name}`, date, server_name),
    ...container.uses
        ? reduce([], (commands: Command<any>[], uses_name: string) =>
            commands.concat(fromContainerinstanceUses(date, `${server_name}_${name}`, uses_name, container.uses[uses_name])))
            (Object.keys(container.uses))
        : []];


const fromServer = (date: Date, environment: string, name: string, server: StoryServer): Command<any>[] =>
    [mergeServer(date, name, server.description, environment, server.os, server.tier, server.datacenter, server.cpu, server.memory),
    ...server.containers
        ? reduce([], (commands: Command<any>[], container_name: string) =>
            commands.concat(fromContainerInstance(date, name, container_name, server.containers[container_name])))
            (Object.keys(server.containers))
        : []];


const fromEnvironment = (date: Date, name: string, environment: StoryEnvironment): Command<any>[] =>
    environment.servers
        ? reduce([], (commands: Command<any>[], server_name: string) =>
            commands.concat(fromServer(date, name, server_name, environment.servers[server_name])))
            (Object.keys(environment.servers))
        : [];


const fromContainerUses = (date: Date, container_name: string, name: string, uses: StoryUses) =>
    [mergeConnection(`${container_name}_${name}`, date, containerId(container_name), { id: name, type: AggregateType[uses.type ?? "container"] })];


const fromContainer = (date: Date, software_system_name: string, name: string, container: StoryContainer): Command<any>[] =>
    [mergeContainer(date, name, container.description, softwareSystemId(software_system_name)),
    ...container.uses
        ? reduce([], (commands: Command<any>[], uses_name: string) =>
            commands.concat(fromContainerUses(date, name, uses_name, container.uses[uses_name])))
            (Object.keys(container.uses))
        : []];


const fromSoftwareSystemUses = (date: Date, software_system_name: string, name: string, uses: StoryUses) =>
    [mergeConnection(`${software_system_name}_${name}`, date, softwareSystemId(software_system_name), { id: name, type: AggregateType[uses.type ?? "container"] })];


const fromSoftwareSystem = (date: Date, name: string, softwareSystem: StorySoftwareSystem): Command<any>[] =>
    [mergeSoftwareSystem(date, name, softwareSystem.description ?? ""),
    ...softwareSystem.containers
        ? reduce([], (commands: Command<any>[], container_name: string) =>
            commands.concat(fromContainer(date, name, container_name, softwareSystem.containers[container_name])))
            (Object.keys(softwareSystem.containers))
        : [],
    ...softwareSystem.uses
        ? reduce([], (commands: Command<any>[], uses_name: string) =>
            commands.concat(fromSoftwareSystemUses(date, name, uses_name, softwareSystem.uses[uses_name])))
            (Object.keys(softwareSystem.uses))
        : []];


const fromStory = (story: Story): Command<any>[] =>
    [...story.environments
        ? reduce([], (commands: Command<any>[], env: string) =>
            commands.concat(fromEnvironment(story.date, env, story.environments[env])))
            (Object.keys(story.environments))
        : [],
    ...story.softwareSystems
        ? reduce([], (commands: Command<any>[], name: string) =>
            commands.concat(fromSoftwareSystem(story.date, name, story.softwareSystems[name])))
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

