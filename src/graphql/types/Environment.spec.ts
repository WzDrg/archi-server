import { getEnvironments } from "./Environment";
import { Server, serverId } from "../../core/aggregates/server";

const ServicesMock = jest.fn(() => ({
    execute_command: jest.fn(),
    execute_commands: jest.fn(),
    get_aggregate: jest.fn(),
    get_aggregates: jest.fn()
}));

const sv1: Server = {
    id: serverId("sv1"),
    name: "sv1",
    description: "First server",
    segment: "TST"
};

const sv2: Server = {
    id: serverId("sv2"),
    name: "sv2",
    description: "First server",
    segment: "ACC"
};

describe("getEnvironments", () => {
    it("should retrieve no environments", () => {
        const servers = [];
        const container_instances = [];
        const services = new ServicesMock();
        services.get_aggregates
            .mockReturnValueOnce(servers)
            .mockReturnValueOnce(container_instances);
        const environments = getEnvironments(services)();
        expect(environments).toHaveLength(0);
        expect(services.get_aggregates).toHaveBeenCalledTimes(1);
    });

    it("should retrieve a single environment", () => {
        const servers = [sv1];
        const container_instances = [];
        const services = new ServicesMock();
        services.get_aggregates
            .mockReturnValueOnce(servers)
            .mockReturnValueOnce(container_instances);
        const environments = getEnvironments(services)();
        expect(environments).toHaveLength(1);
        expect(environments[0]).toHaveProperty("name", sv1.segment);
        expect(services.get_aggregates).toHaveBeenCalledTimes(1);
    });

    it("should retrieve multiple environments", () => {
        const servers = [sv1, sv2];
        const container_instances = [];
        const services = new ServicesMock();
        services.get_aggregates
            .mockReturnValueOnce(servers)
            .mockReturnValueOnce(container_instances);
        const environments = getEnvironments(services)();
        expect(environments).toHaveLength(2);
        expect(environments[0]).toHaveProperty("name", sv1.segment);
        expect(services.get_aggregates).toHaveBeenCalledTimes(1);
    });
});