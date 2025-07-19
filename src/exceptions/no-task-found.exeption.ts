export class NoTaskFoundException extends Error {
  constructor(taskName: string) {
    super(`No tasks found for '${taskName}'`);
    this.name = 'NoTaskFoundException';
  }
}