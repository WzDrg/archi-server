import { pipe } from "fp-ts/lib/pipeable";
import { none, Option, isSome, toNullable } from "fp-ts/lib/Option";
import { reduce, map, filter } from "fp-ts/lib/Array";
import { toArray } from "fp-ts/lib/Record";
import { Command, Aggregate, AggregateType, Event } from "./types";
import { EventStore } from "./event_store";

type GetAggregate = <T extends AggregateType>(type: T, id: string) => Option<Aggregate<T>>;
type GetAggregates = <T extends AggregateType>(type: T) => Aggregate<T>[];
type ExecuteCommand = <T extends AggregateType>(command: Command<T>) => Event<T>[];
type ExecuteCommands = (commands: Command<any>[]) => Event<any>[];

export interface Services {
    get_aggregate: GetAggregate;
    get_aggregates: GetAggregates;
    execute_command: ExecuteCommand;
    execute_commands: ExecuteCommands;
}


const eventsToAggregate = <T extends AggregateType>(events: Event<T>[]) =>
    reduce(none, (state: Option<Aggregate<T>>, event: Event<T>) => event.apply(state))(events);

// Construct a single aggregate using the available events
const getAggregate = (event_store: EventStore): GetAggregate =>
    <T extends AggregateType>(type: T, id: string) =>
        pipe(
            event_store.get_events_of_aggregate(type, id),
            eventsToAggregate
        );

const groupById = <T extends AggregateType>(events: Event<T>[]): Event<T>[][] =>
    pipe(
        events.reduce((result, event) => {
            (result[event.id.id] = result[event.id.id] || []).push(event);
            return result;
        }, {}),
        toArray,
        map(([K, V]) => V)
    );

// Get all aggregates of a specific type
const getAggregates = (event_store: EventStore): GetAggregates =>
    <T extends AggregateType>(type: T) =>
        pipe(
            event_store.get_events_of_type(type),
            groupById,
            map(eventsToAggregate),
            filter(isSome),
            map(toNullable)
        );

// Execute a single command and return all events that were created
const executeCommand = (event_store: EventStore): ExecuteCommand =>
    <T extends AggregateType>(command: Command<T>): Event<T>[] =>
        pipe(
            getAggregate(event_store)(command.id.type, command.id.id),
            command,
            event_store.store_events
        );

// Execute a number of commands and return all events that were created
const executeCommands = (event_store: EventStore): ExecuteCommands =>
    (commands: Command<any>[]) =>
        reduce([], (result: Event<any>[], command: Command<any>) => result.concat(executeCommand(event_store)(command)))(commands);


export const services = (event_store: EventStore): Services => ({
    get_aggregate: getAggregate(event_store),
    get_aggregates: getAggregates(event_store),
    execute_command: executeCommand(event_store),
    execute_commands: executeCommands(event_store)
})