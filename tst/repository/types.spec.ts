import { aggregateTypes, AggregateType } from "../../src/repository/types"

describe("aggregateTypes", () => {
    it("should contain all aggregate types", () => {
        expect(aggregateTypes).toHaveLength(8);
        expect(aggregateTypes).toContain(AggregateType.Server);
    });
})