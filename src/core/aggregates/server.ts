import { Option, none, some, isNone, isSome, toNullable } from "fp-ts/lib/Option";
import { Aggregate, Event, Command, ApplyEvent, AggregateType, AggregateId } from "../types";

export const serverId = (id: string): AggregateId<AggregateType.Server> => ({
  type: AggregateType.Server,
  id: id
});

export interface Server extends Aggregate<AggregateType.Server> {
  name: string;
  description: string;
  operating_system?: string;
  tier?: number;
  datacenter?: string;
  cpu?: number;
  memory?: string;
}

const applyServerCreated = (name: string, description: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): ApplyEvent<AggregateType.Server> =>
  (server: Option<Server>): Option<Server> =>
    isNone(server)
      ? some({
        id: serverId(name),
        name: name,
        description: description,
        operating_system: operating_system,
        tier: tier,
        datacenter: datacenter,
        cpu: cpu,
        memory: memory
      })
      : server;

export const createServer = (name: string, description: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): Command<AggregateType.Server> =>
  Object.assign(
    (server: Option<Server>) => {
      return (isSome(server))
        ? []
        : [{
          id: serverId(name),
          name: name,
          description: description,
          operating_system: operating_system,
          tier: tier,
          datacenter: datacenter,
          cpu: cpu,
          memory: memory,
          apply: applyServerCreated(name, description, operating_system, tier, datacenter, cpu, memory)
        }];
    }, { id: serverId(name) });

const applyServerUpdated = (name: string, description: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): ApplyEvent<AggregateType.Server> =>
  (server: Option<Server>): Option<Server> => {
    return isNone(server) ? none : some({
      id: serverId(name),
      name: name,
      description: description,
      operating_system: operating_system,
      tier: tier,
      datacenter: datacenter,
      cpu: cpu,
      memory: memory,
    });
  }

export const updateServer = (name: string, description: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): Command<AggregateType.Server> =>
  Object.assign(
    (server: Option<Server>): Event<AggregateType.Server>[] => {
      return isNone(server)
        ? []
        : [{
          id: serverId(name),
          name: name,
          description: description,
          operating_system: operating_system,
          tier: tier,
          datacenter: datacenter,
          cpu: cpu,
          memory: memory,
          apply: applyServerUpdated(name, description, operating_system, tier, datacenter, cpu, memory)
        }]
    }, { id: serverId(name) });

export const mergeServer = (name: string, description?: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): Command<AggregateType.Server> =>
  Object.assign((server: Option<Server>): Event<AggregateType.Server>[] => {
    return isNone(server)
      ? createServer(name, description ?? "", operating_system, tier, datacenter, cpu, memory)(server)
      : updateServer(
        name,
        description ?? toNullable(server).description,
        operating_system ?? toNullable(server).operating_system,
        tier ?? toNullable(server).tier,
        datacenter ?? toNullable(server).datacenter,
        cpu ?? toNullable(server).cpu,
        memory ?? toNullable(server).memory)(server);
  }, { id: serverId(name) });
