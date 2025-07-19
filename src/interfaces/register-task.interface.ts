export interface IParallelTasks {
  execute<T, R>(taskName: string, context: T): Promise<R[]>;
}
