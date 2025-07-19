export interface TasksValueMetadataArgs {
  /**
   * Name of task to be executed
   */
  readonly taskName: string;

  /**
   * Method to be executed
   */
  readonly target: (...args: any[]) => any;
}
