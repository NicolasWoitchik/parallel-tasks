/**
 * Main interface for the ParallelTasks framework.
 * 
 * Defines the contract for executing registered tasks in parallel with robust error handling.
 * 
 * @public
 * @interface IParallelTasks
 * 
 * @example
 * ```typescript
 * const parallelTasks: IParallelTasks = new ParallelTasks({
 *   tasks: ['./tasks/**\/*.task.ts']
 * });
 * 
 * await parallelTasks.initialize();
 * const results = await parallelTasks.execute('USER_VALIDATION', userData);
 * ```
 */
export interface IParallelTasks {
  /**
   * Executes all registered tasks with the specified name in parallel.
   * 
   * Uses Promise.allSettled to ensure task isolation - if one task fails,
   * others continue execution. Both successful results and errors are returned.
   * 
   * @template T - Type of the context object passed to all tasks
   * @template R - Expected return type of the tasks (actual results may vary)
   * 
   * @param taskName - The name of the tasks to execute (case-sensitive)
   * @param context - Context object passed to all matching tasks
   * 
   * @returns Promise resolving to an array containing all results (successes and errors)
   * 
   * @throws {Error} When no tasks are found with the specified name
   * 
   * @remarks
   * - Tasks execute concurrently, not sequentially
   * - Failed tasks return Error objects instead of throwing
   * - Order of results matches registration order, not completion order
   * - Context is passed by reference - mutations affect all tasks
   * 
   * @example
   * ```typescript
   * interface UserData {
   *   email: string;
   *   cpf: string;
   * }
   * 
   * interface ValidationResult {
   *   field: string;
   *   valid: boolean;
   *   error?: string;
   * }
   * 
   * const results = await parallelTasks.execute<UserData, ValidationResult>(
   *   'USER_VALIDATION',
   *   { email: 'user@example.com', cpf: '12345678901' }
   * );
   * 
   * // Separate successes from errors
   * const successes = results.filter(r => !(r instanceof Error));
   * const errors = results.filter(r => r instanceof Error);
   * ```
   */
  execute<T, R>(taskName: string, context: T): Promise<R[]>;
}
