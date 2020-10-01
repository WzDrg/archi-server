import { AggregateId } from "../../core/network/aggregate/AggregateId";
import { AggregateType } from "../../core/network/aggregate/AggregateType";

const aggregateTypeToItemType = (aggregateType: AggregateType) => {
    switch (aggregateType) {
        case AggregateType.Actor:
            return "ACTOR";
        case AggregateType.SoftwareSystem:
            return "SOFTWARESYSTEM";
        case AggregateType.Container:
            return "CONTAINER";
    }
    return "SOFTWARESYSTEM";
}

export const aggregateIdToReference = (aggregateId: AggregateId<any>) =>
    ({
        type: aggregateTypeToItemType(aggregateId.type),
        name: aggregateId.id
    })    
