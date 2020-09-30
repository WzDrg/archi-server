import { pipe } from "fp-ts/lib/pipeable";
import { reduce, } from "fp-ts/lib/Array";

import { Command, AggregateType } from "./model/types";
import { EventStore } from "./proxy/EventStore";
import { getAggregate } from "./AggregateServices";


type AppendCommand = <T extends AggregateType>(command: Command<T>) => EventStore;
type AppendCommands = (commands: Command<any>[]) => EventStore;



// Execute a single command and return all events that were created
export const appendCommand = (event_store: EventStore): AppendCommand =>
    <T extends AggregateType>(command: Command<T>): EventStore =>
        pipe(
            getAggregate(event_store)(command.id),
            command,
            event_store.store_events
        );

// Execute a number of commands and return all events that were created
export const appendCommands = (event_store: EventStore): AppendCommands =>
    (commands: Command<any>[]) =>
        reduce(event_store, (result: EventStore, command: Command<any>) => appendCommand(result)(command))(commands);

