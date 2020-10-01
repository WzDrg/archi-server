import { pipe } from "fp-ts/lib/pipeable";
import { reduce, } from "fp-ts/lib/Array";

import { Command } from "./Command";
import { AggregateType } from "../aggregate/AggregateType";
import { EventStore } from "../event/EventStorage";
import { getAggregate } from "../../AggregateServices";

export const executeCommand = (event_store: EventStore)=>
    <T extends AggregateType>(command: Command<T>): EventStore =>
        pipe(
            getAggregate(event_store)(command.id),
            command,
            event_store.store_events
        );

export const appendCommands = (event_store: EventStore)=>
    (commands: Command<any>[]) =>
        reduce(event_store, (result: EventStore, command: Command<any>) => executeCommand(result)(command))(commands);

