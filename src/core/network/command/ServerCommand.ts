import { Option, none, some, isNone, isSome, toNullable } from "fp-ts/lib/Option";
import { Server } from "../aggregate/Aggregates";
import { Command } from "./Command";
import { ApplyEvent, Event } from "../event/Event";
import { AggregateType } from "../aggregate/AggregateType";
import { serverId } from "../aggregate/AggregateId";

const applyServerCreated = (date: Date, name: string, description: string, segment?: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): ApplyEvent<AggregateType.Server> =>
  (server: Option<Server>): Option<Server> =>
    isNone(server)
      ? some({
        id: serverId(name),
        createdOn: date,
        updatedOn: date,
        name: name,
        description: description,
        segment: segment,
        operating_system: operating_system,
        tier: tier,
        datacenter: datacenter,
        cpu: cpu,
        memory: memory
      })
      : server;

export const createServer = (date: Date, name: string, description: string, segment?: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): Command<AggregateType.Server> =>
  Object.assign(
    (server: Option<Server>) => {
      return (isSome(server))
        ? []
        : [{
          id: serverId(name),
          date: date,
          name: name,
          description: description,
          segment: segment,
          operating_system: operating_system,
          tier: tier,
          datacenter: datacenter,
          cpu: cpu,
          memory: memory,
          apply: applyServerCreated(date, name, description, segment, operating_system, tier, datacenter, cpu, memory)
        }];
    }, { id: serverId(name) });

const applyServerUpdated = (date: Date, name: string, description: string, segment?: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): ApplyEvent<AggregateType.Server> =>
  (server: Option<Server>): Option<Server> => {
    return isNone(server) ? none : some({
      id: serverId(name),
      createdOn: toNullable(server).createdOn,
      updatedOn: date,
      name: name,
      description: description,
      segment: segment,
      operating_system: operating_system,
      tier: tier,
      datacenter: datacenter,
      cpu: cpu,
      memory: memory,
    });
  }

export const updateServer = (date: Date, name: string, description: string, segment?: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): Command<AggregateType.Server> =>
  Object.assign(
    (server: Option<Server>): Event<AggregateType.Server>[] => {
      return isNone(server)
        ? []
        : [{
          id: serverId(name),
          date: date,
          name: name,
          description: description,
          segment: segment,
          operating_system: operating_system,
          tier: tier,
          datacenter: datacenter,
          cpu: cpu,
          memory: memory,
          apply: applyServerUpdated(date, name, description, segment, operating_system, tier, datacenter, cpu, memory)
        }]
    }, { id: serverId(name) });

// Command to merge a server configuration
export const mergeServer = (date: Date, name: string, description?: string, segment?: string, operating_system?: string, tier?: number, datacenter?: string, cpu?: number, memory?: string): Command<AggregateType.Server> =>
  Object.assign((server: Option<Server>): Event<AggregateType.Server>[] => {
    return isNone(server)
      ? createServer(date, name, description ?? "", segment, operating_system, tier, datacenter, cpu, memory)(server)
      : updateServer(
        date,
        name,
        description ?? toNullable(server).description,
        segment ?? toNullable(server).segment,
        operating_system ?? toNullable(server).operating_system,
        tier ?? toNullable(server).tier,
        datacenter ?? toNullable(server).datacenter,
        cpu ?? toNullable(server).cpu,
        memory ?? toNullable(server).memory)(server);
  }, { id: serverId(name) });
