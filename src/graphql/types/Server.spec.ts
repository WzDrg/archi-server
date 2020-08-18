import { serversOfEnvironment } from "./Server";
import { Server as CoreServer, serverId } from "../../core/aggregates/server";

const mockServices = {
    execute_command: jest.fn(),
    execute_commands: jest.fn(),
    get_aggregate: jest.fn(),
    get_aggregates: jest.fn()
};

const sv1: CoreServer = {
    id: serverId("sv1"),
    name: "sv1",
    description: "Server",
    segment: "TST"
};

const sv2: CoreServer = {
    id: serverId("sv2"),
    name: "sv2",
    description: "Server",
    segment: "TST"
};

const sv3: CoreServer = {
    id: serverId("sv3"),
    name: "sv3",
    description: "Server"
};

describe("serversOfEnvironment", () => {
    it("should return a server of the environment", () => {
        mockServices.get_aggregates
            .mockReset()
            .mockReturnValueOnce([sv1]);
        const servers = serversOfEnvironment(mockServices)("TST");
        expect(servers).toHaveLength(1);
        expect(mockServices.get_aggregates).toHaveBeenCalledTimes(1);
    });

    it("should not return a server of another environment", () => {
        mockServices.get_aggregates
            .mockReset()
            .mockReturnValueOnce([sv1]);
        const servers = serversOfEnvironment(mockServices)("ACC");
        expect(servers).toHaveLength(0);
        expect(mockServices.get_aggregates).toHaveBeenCalledTimes(1);
    });

    it("should return multiple servers", () => {
        mockServices.get_aggregates
            .mockReset()
            .mockReturnValueOnce([sv1, sv2]);
        const servers = serversOfEnvironment(mockServices)("TST");
        expect(servers).toHaveLength(2);
        expect(mockServices.get_aggregates).toHaveBeenCalledTimes(1);
    });

    it("should return a server with no environment", () => {
        mockServices.get_aggregates
            .mockReset()
            .mockReturnValueOnce([sv3]);
        const servers = serversOfEnvironment(mockServices)("");
        expect(servers).toHaveLength(1);
        expect(mockServices.get_aggregates).toHaveBeenCalledTimes(1);
    });
});