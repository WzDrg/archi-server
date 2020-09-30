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
