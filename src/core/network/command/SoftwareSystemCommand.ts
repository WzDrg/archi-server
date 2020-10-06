import { SoftwareSystem } from "../aggregate/Aggregates";
import { Command } from "./Command";
import { AggregateType } from "../aggregate/AggregateType";
import { isSome, some, Option, isNone, toNullable } from "fp-ts/lib/Option";
import { AggregateId, softwareSystemId } from "../aggregate/AggregateId";

const applySoftwareSystemCreated = (date: Date, name: string, description: string) =>
    (state: Option<SoftwareSystem>): Option<SoftwareSystem> =>
        isSome(state)
            ? state
            : some({
                id: softwareSystemId(name),
                createdOn: date,
                updatedOn: date,
                name: name,
                description: description
            });

export const createSoftwareSystem = (date: Date, name: string, description: string): Command<AggregateType.SoftwareSystem> =>
    Object.assign((state: Option<SoftwareSystem>) => {
        return isSome(state) ? [] : [{
            id: softwareSystemId(name),
            date: date,
            name: name,
            description: description,
            apply: applySoftwareSystemCreated(date, name, description)
        }]
    }, { id: softwareSystemId(name) });

const applySoftwareSystemUpdated = (id: AggregateId<AggregateType.SoftwareSystem>, date: Date, description: string) =>
    (state: Option<SoftwareSystem>): Option<SoftwareSystem> =>
        isNone(state)
            ? state
            : some({
                id: id,
                createdOn: toNullable(state).createdOn,
                updatedOn: date,
                name: toNullable(state).name,
                description: description
            });

export const updateSoftwareSystem = (id: AggregateId<AggregateType.SoftwareSystem>, date: Date, description: string): Command<AggregateType.SoftwareSystem> =>
    Object.assign((state: Option<SoftwareSystem>) => {
        return isNone(state) ? [] : [{
            id: id,
            date: date,
            description: description,
            apply: applySoftwareSystemUpdated(id, date, description)
        }]
    }, { id: id });

export const mergeSoftwareSystem = (date: Date, name: string, description: string): Command<AggregateType.SoftwareSystem> =>
    Object.assign((state: Option<SoftwareSystem>) => {
        return isNone(state)
            ? createSoftwareSystem(date, name, description)(state)
            : updateSoftwareSystem(softwareSystemId(name), date, description)(state);
    }, { id: softwareSystemId(name) });
