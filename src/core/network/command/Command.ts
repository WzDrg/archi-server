import { Option } from "fp-ts/lib/Option";
import { AggregateId } from "../aggregate/AggregateId";
import { AggregateType } from "../aggregate/AggregateType";
import { Event } from "../event/Event";
import { Aggregate } from "../aggregate/Aggregates";



export interface Command<S extends AggregateType> {
  (state: Option<Aggregate<S>>): Event<S>[];
  id: AggregateId<S>;
}
