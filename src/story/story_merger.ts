import { reduce, map, filter } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import { safeLoad } from 'js-yaml';
import { readdirSync } from "fs";

import { Story, Environment, Server, ContainerInstance, SoftwareSystem, Container, Uses, Communication } from "./story";
import { Services } from "../core/service";
import { Command, AggregateType, AggregateId } from "../core/types";
import { mergeServer } from "../core/aggregates/server";
import { mergeContainerInstance, containerInstanceId } from "../core/aggregates/container_instance";
import { mergeSoftwareSystem, softwareSystemId } from "../core/aggregates/software_system";
import { mergeContainer, containerId } from "../core/aggregates/container";
import { mergeConnection } from "../core/aggregates/connection";
import { mergeConnectionInstance } from "../core/aggregates/connection_instance";
import { join, resolve } from "path";
import { readFileSync } from "fs";

const toTargetInstanceId = (id: string, type?: string): AggregateId<any> =>
    ({ id: id, type: type ? AggregateType[type] : AggregateType.ContainerInstance });


const fromContainerinstanceUses = (container_instance_name: string, name: string, communication: Communication): Command<any>[] =>
    [mergeConnectionInstance(name, containerInstanceId(container_instance_name), toTargetInstanceId(name, communication.type))];


const fromContainerInstance = (server_name: string, name: string, container: ContainerInstance): Command<any>[] =>
    [container.container
        ? mergeContainerInstance(`${server_name}_${name}`, server_name, containerId(container.container))
        : mergeContainerInstance(`${server_name}_${name}`, server_name),
    ...container.uses
        ? reduce([], (commands: Command<any>[], uses_name: string) =>
            commands.concat(fromContainerinstanceUses(`${server_name}_${name}`, uses_name, container.uses[uses_name])))
            (Object.keys(container.uses))
        : []];


const fromServer = (name: string, server: Server): Command<any>[] =>
    [mergeServer(name, server.description, server.os, server.tier, server.datacenter, server.cpu, server.memory),
    ...server.containers
        ? reduce([], (commands: Command<any>[], container_name: string) =>
            commands.concat(fromContainerInstance(name, container_name, server.containers[container_name])))
            (Object.keys(server.containers))
        : []];


const fromEnvironment = (name: string, environment: Environment): Command<any>[] =>
    environment.servers
        ? reduce([], (commands: Command<any>[], server_name: string) =>
            commands.concat(fromServer(server_name, environment.servers[server_name])))
            (Object.keys(environment.servers))
        : [];


const fromContainerUses = (container_name: string, name: string, uses: Uses) =>
    [mergeConnection(`${container_name}_${name}`, containerId(container_name), { id: name, type: AggregateType[uses.type ?? "container"] })];


const fromContainer = (software_system_name: string, name: string, container: Container): Command<any>[] =>
    [mergeContainer(name, container.description, softwareSystemId(software_system_name)),
    ...container.uses
        ? reduce([], (commands: Command<any>[], uses_name: string) =>
            commands.concat(fromContainerUses(name, uses_name, container.uses[uses_name])))
            (Object.keys(container.uses))
        : []];


const fromSoftwareSystemUses = (software_system_name: string, name: string, uses: Uses) =>
    [mergeConnection(`${software_system_name}_${name}`, softwareSystemId(software_system_name), { id: name, type: AggregateType[uses.type ?? "container"] })];


const fromSoftwareSystem = (name: string, softwareSystem: SoftwareSystem): Command<any>[] =>
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


export const fromStory = (story: Story): Command<any>[] =>
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


// Convert a yaml string to a story
const stringToStory = (content: string) => {
    return safeLoad(content) as Story;
}

// Process the content of a single story
export const processStory = (services: Services) =>
    (content: string) =>
        pipe(
            stringToStory(content),
            fromStory,
            services.execute_commands
        );

// Process all stories contained within a folder
export const processStoriesOfFolder = (services: Services) =>
    (folder: string) =>
        pipe(
            readdirSync(folder),
            map(filename => resolve(join(folder, filename))),
            filter(filename => filename.toUpperCase().endsWith(".YML") || filename.toUpperCase().endsWith(".YAML")),
            map(filename => readFileSync(filename, { encoding: 'UTF-8' })),
            map(processStory(services))
        )