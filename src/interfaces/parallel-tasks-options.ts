import { MixedList } from "../commons/mixed-list";

export interface IParallelTasksOptions {
  tasks?: MixedList<Function | string>;
}