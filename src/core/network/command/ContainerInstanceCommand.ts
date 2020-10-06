import { Option, isSome, some, isNone, toNullable } from "fp-ts/lib/Option";

import { ContainerInstance } from "../aggregate/Aggregates";
import { AggregateId, containerInstanceId, serverId } from "../aggregate/AggregateId";
import { Command } from "./Command";
import { Event, ApplyEvent } from "../event/Event";
import { AggregateType } from "../aggregate/AggregateType";

const applyContainerInstanceCreated = (id: AggregateId<AggregateType.ContainerInstance>, date: Date, server_id: AggregateId<AggregateType.Server>, container_id?: AggregateId<AggregateType.Container>): ApplyEvent<AggregateType.ContainerInstance> =>
    (state: Option<ContainerInstance>): Option<ContainerInstance> => {
        return isSome(state) ? state : some({
            id: id,
            createdOn: date,
            updatedOn: date,
            container_id: container_id,
            server_id: server_id
        });
    }

export const createContainerInstance = (id: string, date: Date, server_name: string, container_id?: AggregateId<AggregateType.Container>): Command<AggregateType.ContainerInstance> =>
    Object.assign((state: Option<ContainerInstance>): Event<AggregateType.ContainerInstance>[] => {
        return isSome(state) ? []
            : [{
                id: containerInstanceId(id),
                date: date,
                server_id: serverId(server_name),
                container_id: container_id,
                apply: applyContainerInstanceCreated(containerInstanceId(id), date, serverId(server_name), container_id)
            }];
    }, { id: containerInstanceId("") });

const applyContainerInstanceUpdated = (id: AggregateId<AggregateType.ContainerInstance>, date: Date) =>
    (state: Option<ContainerInstance>): Option<ContainerInstance> => {
        return isNone(state) ? state : some({
            id: toNullable(state).id,
            createdOn: toNullable(state).createdOn,
            updatedOn: date,
            server_id: toNullable(state).server_id
        })
    }

export const updateContainerInstance = (id: AggregateId<AggregateType.ContainerInstance>, date: Date) =>
    Object.assign((state: Option<ContainerInstance>) => {
        return isNone(state) ? []
            : [{
                id: id,
                date: date,
                apply: applyContainerInstanceUpdated(id, date)
            }];
    }, { id: id });

export const mergeContainerInstance = (id: string, date: Date, server_name: string, container_id?: AggregateId<AggregateType.Container>) =>
    Object.assign((state: Option<ContainerInstance>) => {
        return isSome(state)
            ? updateContainerInstance(containerInstanceId(id), date)(state)
            : createContainerInstance(id, date, server_name, container_id)(state);
    }, { id: containerInstanceId(id) });