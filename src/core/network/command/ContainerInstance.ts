import { Option, isSome, some, isNone, toNullable } from "fp-ts/lib/Option";
import { AggregateId, Event, AggregateType, ApplyEvent, Command, ContainerInstance, containerInstanceId, serverId } from "../model/Aggregates";

const applyContainerInstanceCreated = (id: AggregateId<AggregateType.ContainerInstance>, server_id: AggregateId<AggregateType.Server>, container_id?: AggregateId<AggregateType.Container>): ApplyEvent<AggregateType.ContainerInstance> =>
    (state: Option<ContainerInstance>): Option<ContainerInstance> => {
        return isSome(state) ? state : some({
            id: id,
            container_id: container_id,
            server_id: server_id
        });
    }

export const createContainerInstance = (id: string, server_name: string, container_id?: AggregateId<AggregateType.Container>): Command<AggregateType.ContainerInstance> =>
    Object.assign((state: Option<ContainerInstance>): Event<AggregateType.ContainerInstance>[] => {
        return isSome(state) ? []
            : [{
                id: containerInstanceId(id),
                server_id: serverId(server_name),
                container_id: container_id,
                apply: applyContainerInstanceCreated(containerInstanceId(id), serverId(server_name), container_id)
            }];
    }, { id: containerInstanceId("") });

const applyContainerInstanceUpdated = (id: AggregateId<AggregateType.ContainerInstance>) =>
    (state: Option<ContainerInstance>): Option<ContainerInstance> => {
        return isNone(state) ? state : some({
            id: toNullable(state).id,
            server_id: toNullable(state).server_id
        })
    }

export const updateContainerInstance = (id: AggregateId<AggregateType.ContainerInstance>) =>
    Object.assign((state: Option<ContainerInstance>) => {
        return isNone(state) ? []
            : [{
                id: id,
                apply: applyContainerInstanceUpdated(id)
            }];
    }, { id: id });

export const mergeContainerInstance = (id: string, server_name: string, container_id?: AggregateId<AggregateType.Container>) =>
    Object.assign((state: Option<ContainerInstance>) => {
        return isSome(state)
            ? updateContainerInstance(containerInstanceId(id))(state)
            : createContainerInstance(id, server_name, container_id)(state);
    }, { id: containerInstanceId(id) });