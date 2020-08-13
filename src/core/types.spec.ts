import { aggregateTypes, AggregateType } from "./types"

describe("aggregateTypes", () => {
    it("should contain all aggregate types", () => {
        expect(aggregateTypes).toHaveLength(8);
        expect(aggregateTypes).toContain(AggregateType.Server);
    });
})