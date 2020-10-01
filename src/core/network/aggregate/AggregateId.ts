import { AggregateType } from "./AggregateType";

export interface AggregateId<T extends AggregateType> {
  id: string;
  type: T;
}

export const eqAggregateId = (id1: AggregateId<any>, id2: AggregateId<any>): boolean =>
  id1.id === id2.id && id1.type === id2.type;

export const actorId = (id: string): AggregateId<AggregateType.Actor> => ({
  id: id,
  type: AggregateType.Actor
});

export const connectionId = (id: string): AggregateId<AggregateType.Connection> => ({
  id: id,
  type: AggregateType.Connection
});

export const connectionInstanceId = (id: string): AggregateId<AggregateType.ConnectionInstance> => ({
  id: id,
  type: AggregateType.ConnectionInstance
});

export const containerId = (name: string): AggregateId<AggregateType.Container> =>
  ({
    id: name,
    type: AggregateType.Container
  });

export const containerInstanceId = (id: string): AggregateId<AggregateType.ContainerInstance> =>
  ({ type: AggregateType.ContainerInstance, id: id });

export const serverId = (id: string): AggregateId<AggregateType.Server> => ({
  type: AggregateType.Server,
  id: id
});

export const softwareSystemId = (name: string): AggregateId<AggregateType.SoftwareSystem> =>
  ({ id: name, type: AggregateType.SoftwareSystem });
