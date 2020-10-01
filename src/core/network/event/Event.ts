import { Option } from "fp-ts/lib/Option";

import { AggregateId } from "../aggregate/AggregateId";
import { AggregateType } from "../aggregate/AggregateType";
import { Aggregate} from "../aggregate/Aggregates";


export interface Event<S extends AggregateType> {
  id: AggregateId<S>;
  apply: ApplyEvent<S>;
  [s: string]: any;
}

export type ApplyEvent<S extends AggregateType> = (state: Option<Aggregate<S>>) => Option<Aggregate<S>>;

