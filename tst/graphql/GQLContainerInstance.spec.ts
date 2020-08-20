import { getContainerInstancesOfServer } from "../../src/graphql/types/GQLContainerInstance";
import { serverId } from "../../src/core/aggregates/server";
import { ContainerInstance, containerInstanceId } from "../../src/core/aggregates/container_instance";

const services = {
    execute_command: jest.fn(),
    execute_commands: jest.fn(),
    get_aggregate: jest.fn(),
    get_aggregates: jest.fn()
}

const ci1: ContainerInstance = {
    id: containerInstanceId("ci1"),
    server_id: serverId("sv1")
}


describe("containerinstancesOfServer", () => {
    it("should return an empty list with single instance", () => {
        services.get_aggregates
            .mockReset()
            .mockReturnValueOnce([ci1]);
        const result = getContainerInstancesOfServer(services)(ci1.server_id);
        expect(result).toHaveLength(1);
        expect(services.get_aggregates).toHaveBeenCalledTimes(1);
    });

    it("should return an empty list with no instances", () => {
        services.get_aggregates
            .mockReset()
            .mockReturnValueOnce([ci1]);
        const result = getContainerInstancesOfServer(services)(serverId("sv"));
        expect(result).toHaveLength(0);
        expect(services.get_aggregates).toHaveBeenCalledTimes(1);
    });
});