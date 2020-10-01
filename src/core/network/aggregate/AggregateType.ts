
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