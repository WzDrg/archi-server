import { Aggregate, AggregateType, AggregateId, Command } from "../types";
import { isSome, some, Option, isNone, toNullable } from "fp-ts/lib/Option";

export const softwareSystemId = (name: string): AggregateId<AggregateType.SoftwareSystem> =>
    ({ id: name, type: AggregateType.SoftwareSystem });

export interface SoftwareSystem extends Aggregate<AggregateType.SoftwareSystem> {
    name: string;
    description: string;
}

const applySoftwareSystemCreated = (name: string, description: string) =>
    (state: Option<SoftwareSystem>): Option<SoftwareSystem> =>
        isSome(state)
            ? state
            : some({
                id: softwareSystemId(name),
                name: name,
                description: description
            });

export const createSoftwareSystem = (name: string, description: string): Command<AggregateType.SoftwareSystem> =>
    Object.assign((state: Option<SoftwareSystem>) => {
        return isSome(state) ? [] : [{
            id: softwareSystemId(name),
            name: name,
            description: description,
            apply: applySoftwareSystemCreated(name, description)
        }]
    }, { id: softwareSystemId(name) });

const applySoftwareSystemUpdated = (id: AggregateId<AggregateType.SoftwareSystem>, description: string) =>
    (state: Option<SoftwareSystem>): Option<SoftwareSystem> =>
        isNone(state)
            ? state
            : some({
                id: id,
                name: toNullable(state).name,
                description: description
            });

export const updateSoftwareSystem = (id: AggregateId<AggregateType.SoftwareSystem>, description: string): Command<AggregateType.SoftwareSystem> =>
    Object.assign((state: Option<SoftwareSystem>) => {
        return isNone(state) ? [] : [{
            id: id,
            description: description,
            apply: applySoftwareSystemUpdated(id, description)
        }]
    }, { id: id });

export const mergeSoftwareSystem = (name: string, description: string): Command<AggregateType.SoftwareSystem> =>
    Object.assign((state: Option<SoftwareSystem>) => {
        return isNone(state)
            ? createSoftwareSystem(name, description)(state)
            : updateSoftwareSystem(softwareSystemId(name), description)(state);
    }, { id: softwareSystemId(name) });
