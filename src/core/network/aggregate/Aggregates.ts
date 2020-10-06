import { AggregateId } from "./AggregateId";
import { AggregateType } from "./AggregateType";

export interface Aggregate<T extends AggregateType> {
  id: AggregateId<T>;
  createdOn: Date;
  updatedOn: Date;
}

export interface Actor extends Aggregate<AggregateType.Actor> {
  name: string;
  description: string;
}

export interface Connection extends Aggregate<AggregateType.Connection> {
  sourceId: AggregateId<any>;
  targetId: AggregateId<any>;
}

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

export interface ContainerInstance extends Aggregate<AggregateType.ContainerInstance> {
  server_id: AggregateId<AggregateType.Server>;
  container_id?: AggregateId<AggregateType.Container>;
  location?: string;
}

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

export interface SoftwareSystem extends Aggregate<AggregateType.SoftwareSystem> {
  name: string;
  description: string;
}