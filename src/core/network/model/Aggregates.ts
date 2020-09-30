import { Option } from "fp-ts/lib/Option";

export enum AggregateType {
  Actor,
  SoftwareSystem,
  Container,
  Component,
  Server,
  ContainerInstance,
  Connection,
  ConnectionInstance
}

export const aggregateTypes =
  Object.keys(AggregateType)
    .filter(value => isNaN(Number(value)))
    .map(value => AggregateType[value]);

export interface AggregateId<T> {
  id: string;
  type: T;
}

export const eqAggregateId = (id1: AggregateId<any>, id2: AggregateId<any>): boolean =>
  id1.id === id2.id && id1.type === id2.type;

export interface Aggregate<T extends AggregateType> {
  id: AggregateId<T>;
}

export type ApplyEvent<S extends AggregateType> = (state: Option<Aggregate<S>>) => Option<Aggregate<S>>;

export interface Event<S extends AggregateType> {
  id: AggregateId<S>;
  apply: ApplyEvent<S>;
  [s: string]: any;
}

export interface Command<S extends AggregateType> {
  (state: Option<Aggregate<S>>): Event<S>[];
  id: AggregateId<S>;
}

export const actorId = (id: string): AggregateId<AggregateType.Actor> => ({
  id: id,
  type: AggregateType.Actor
});

export interface Actor extends Aggregate<AggregateType.Actor> {
  name: string;
  description: string;
}

export const connectionId = (id: string): AggregateId<AggregateType.Connection> => ({
  id: id,
  type: AggregateType.Connection
});

export interface Connection extends Aggregate<AggregateType.Connection> {
  sourceId: AggregateId<any>;
  targetId: AggregateId<any>;
}

export const connectionInstanceId = (id: string): AggregateId<AggregateType.ConnectionInstance> => ({
  id: id,
  type: AggregateType.ConnectionInstance
});

export interface ConnectionInstance extends Aggregate<AggregateType.ConnectionInstance> {
  connection_id?: AggregateId<AggregateType.Connection>;
  source_instance: AggregateId<any>;
  target_instance: AggregateId<any>;
}

export interface Container extends Aggregate<AggregateType.Container> {
  name: string;
  description: string;
  software_system: AggregateId<AggregateType.SoftwareSystem>;
};

export const containerId = (name: string): AggregateId<AggregateType.Container> =>
  ({
      id: name,
      type: AggregateType.Container
  });

  export interface ContainerInstance extends Aggregate<AggregateType.ContainerInstance> {
    server_id: AggregateId<AggregateType.Server>;
    container_id?: AggregateId<AggregateType.Container>;
    location?: string;
}

export const containerInstanceId = (id: string): AggregateId<AggregateType.ContainerInstance> => ({
    type: AggregateType.ContainerInstance,
    id: id
});

export const serverId = (id: string): AggregateId<AggregateType.Server> => ({
  type: AggregateType.Server,
  id: id
});

export interface Server extends Aggregate<AggregateType.Server> {
  name: string;
  description: string;
  segment?: string;
  operating_system?: string;
  tier?: number;
  datacenter?: string;
  cpu?: number;
  memory?: string;
}

export const softwareSystemId = (name: string): AggregateId<AggregateType.SoftwareSystem> =>
    ({ id: name, type: AggregateType.SoftwareSystem });

export interface SoftwareSystem extends Aggregate<AggregateType.SoftwareSystem> {
    name: string;
    description: string;
}