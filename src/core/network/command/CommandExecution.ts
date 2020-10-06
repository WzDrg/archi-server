import { pipe } from "fp-ts/lib/pipeable";
import { reduce, } from "fp-ts/lib/Array";

import { Command } from "./Command";
import { AggregateType } from "../aggregate/AggregateType";
import { EventStore } from "../event/EventStorage";
import { getAggregateWithIdFromEventStore } from "../../AggregateServices";

export const executeCommand = (event_store: EventStore)=>
    <T extends AggregateType>(command: Command<T>): EventStore =>
        pipe(
            getAggregateWithIdFromEventStore(command.id)(event_store),
            command,
            event_store.store_events
        );

export const appendCommands = (event_store: EventStore)=>
    (commands: Command<any>[]) =>
        reduce(event_store, (result: EventStore, command: Command<any>) => executeCommand(result)(command))(commands);

