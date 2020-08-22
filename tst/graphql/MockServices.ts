import { fromNullable } from "fp-ts/lib/Option";

import { Server, serverId } from "../../src/core/aggregates/server";
import { Aggregate, AggregateType, AggregateId, eqAggregateId } from "../../src/core/types";
import { Container, containerId } from "../../src/core/aggregates/container";
import { ContainerInstance, containerInstanceId } from "../../src/core/aggregates/container_instance";
import { SoftwareSystem, softwareSystemId } from "../../src/core/aggregates/software_system";
import { Connection, connectionId } from "../../src/core/aggregates/connection";

export const createMockServices = (aggregates: Aggregate<any>[]) => {
    const items = aggregates;
    return ({
        get_aggregates: <T extends AggregateType>(type: T) => items.filter(item => item.id.type === type) as Aggregate<T>[],
        get_aggregate: <T extends AggregateType>(id: AggregateId<T>) => fromNullable(items.find(item => eqAggregateId(id, item.id)) as Aggregate<T>),
        execute_command: jest.fn(),
        execute_commands: jest.fn()
    });
}

export const ss_docgen: SoftwareSystem = { id: softwareSystemId("ss1"), name: "Document Generation", description: "" };
export const ss_doccapt: SoftwareSystem = { id: softwareSystemId("ss2"), name: "Document Capture", description: "" };

export const cont_docgen: Container = { id: containerId("cn1"), name: "Container", description: "", software_system: ss_docgen.id };
export const cont_docgen2: Container = { id: containerId("cn2"), name: "Container2", description: "", software_system: ss_docgen.id };

export const con1: Connection = { id: connectionId("con1"), source_id: ss_docgen.id, target_id: ss_doccapt.id };

export const server_tst: Server = { id: serverId("sv1"), name: "Server 1", description: "", segment: "TST" }
export const server_acc: Server = { id: serverId("sv2"), name: "sv2", description: "First server", segment: "ACC" };
export const server_nosegment: Server = { id: serverId("sv3"), name: "sv3", description: "" }
export const server2_tst: Server = { id: serverId("sv4"), name: "sv4", description: "", segment: "TST" }

export const cont_inst: ContainerInstance = { id: containerInstanceId("ci1"), server_id: server_tst.id };
export const cont_inst2: ContainerInstance = { id: containerInstanceId("ci2"), server_id: server_tst.id };