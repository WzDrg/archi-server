import { Container } from "../aggregate/Aggregates";
import { Command } from "./Command";
import { Event } from "../event/Event";
import { AggregateType } from "../aggregate/AggregateType";
import { Option, none, isSome, some, isNone, toNullable } from "fp-ts/lib/Option";
import { AggregateId, containerId } from "../aggregate/AggregateId";

const applyContainerCreated = (date: Date, name: string, description: string, software_system: AggregateId<AggregateType.SoftwareSystem>) =>
    (state: Option<Container>): Option<Container> => {
        return isSome(state) ? state
            : some({
                id: containerId(name),
                createdOn: date,
                updatedOn: date,
                name: name,
                description: description,
                software_system: software_system
            });
    };

export const createContainer = (date: Date, name: string, description: string, software_system: AggregateId<AggregateType.SoftwareSystem>): Command<AggregateType.Container> =>
    Object.assign(
        (state: Option<Container>): Event<AggregateType.Container>[] => {
            return isSome(state) ? []
                : [{
                    id: containerId(name),
                    date: date,
                    name: name,
                    description: description,
                    software_system: software_system,
                    apply: applyContainerCreated(date, name, description, software_system)
                }];
        },
        { id: containerId(name) });

const applyContainerUpdated = (id: AggregateId<AggregateType.Container>, date: Date, description: string) =>
    (state: Option<Container>): Option<Container> => {
        return isNone(state) ? none : some({
            id: toNullable(state).id,
            createdOn: toNullable(state).createdOn,
            updatedOn: date,
            name: toNullable(state).name,
            description: description,
            software_system: toNullable(state).software_system
        });
    };

export const updateContainer = (id: AggregateId<AggregateType.Container>, date: Date, description: string) =>
    Object.assign(
        (state: Option<Container>) => {
            return isNone(state) ? [] : [{
                id: id,
                date: date,
                apply: applyContainerUpdated(id, date, description)
            }]
        }, { id: id });

export const mergeContainer = (date: Date, name: string, description: string, software_system: AggregateId<AggregateType.SoftwareSystem>): Command<AggregateType.Container> =>
    Object.assign((state: Option<Container>) => {
        return isNone(state)
            ? createContainer(date, name, description, software_system)(state)
            : updateContainer(containerId(name), date, description)(state);
    }, { id: containerId(name) });