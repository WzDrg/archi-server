import { AggregateType, AggregateId, Command, Event, Container, containerId } from "../model/Aggregates";
import { Option, none, isSome, some, isNone, toNullable } from "fp-ts/lib/Option";

const applyContainerCreated = (name: string, description: string, software_system: AggregateId<AggregateType.SoftwareSystem>) =>
    (state: Option<Container>): Option<Container> => {
        return isSome(state) ? state
            : some({
                id: containerId(name),
                name: name,
                description: description,
                software_system: software_system
            });
    };

export const createContainer = (name: string, description: string, software_system: AggregateId<AggregateType.SoftwareSystem>): Command<AggregateType.Container> =>
    Object.assign(
        (state: Option<Container>): Event<AggregateType.Container>[] => {
            return isSome(state) ? []
                : [{
                    id: containerId(name),
                    name: name,
                    description: description,
                    software_system: software_system,
                    apply: applyContainerCreated(name, description, software_system)
                }];
        },
        { id: containerId(name) });

const applyContainerUpdated = (id: AggregateId<AggregateType.Container>, description: string) =>
    (state: Option<Container>): Option<Container> => {
        return isNone(state) ? none : some({
            id: toNullable(state).id,
            name: toNullable(state).name,
            description: description,
            software_system: toNullable(state).software_system
        });
    };

export const updateContainer = (id: AggregateId<AggregateType.Container>, description: string) =>
    Object.assign(
        (state: Option<Container>) => {
            return isNone(state) ? [] : [{
                id: id,
                apply: applyContainerUpdated(id, description)
            }]
        }, { id: id });

export const mergeContainer = (name: string, description: string, software_system: AggregateId<AggregateType.SoftwareSystem>): Command<AggregateType.Container> =>
    Object.assign((state: Option<Container>) => {
        return isNone(state)
            ? createContainer(name, description, software_system)(state)
            : updateContainer(containerId(name), description)(state);
    }, { id: containerId(name) });