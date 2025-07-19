/**
 * Metadata arguments for tasks registered via the @RegisterTask decorator.
 * 
 * This interface represents the internal metadata structure used to store
 * task registration information in the global metadata storage.
 * 
 * @internal
 * @interface TasksValueMetadataArgs
 * 
 * @example
 * ```typescript
 * // Internal usage in decorator
 * const metadata: TasksValueMetadataArgs = {
 *   taskName: 'USER_VALIDATION',
 *   target: myValidationMethod
 * };
 * ```
 */
export interface TasksValueMetadataArgs {
  /**
   * The unique identifier for the task group.
   * 
   * Tasks with the same name are executed together when calling execute().
   * This value is case-sensitive and should follow UPPER_SNAKE_CASE convention.
   * 
   * @readonly
   * 
   * @example
   * ```typescript
   * taskName: 'USER_VALIDATION' // ✅ Good
   * taskName: 'user-validation' // ❌ Avoid
   * taskName: 'userValidation' // ❌ Avoid
   * ```
   */
  readonly taskName: string;

  /**
   * The target method/function that will be executed.
   * 
   * This is the actual implementation function decorated with @RegisterTask.
   * The function receives the execution context as its first parameter and
   * should return a Promise or synchronous value.
   * 
   * @readonly
   * 
   * @param args - Arguments passed during task execution (context, etc.)
   * @returns The result of task execution (can be synchronous or asynchronous)
   * 
   * @example
   * ```typescript
   * // Typical target function signature
   * target: async (context: UserData) => Promise<ValidationResult>
   * 
   * // Or synchronous
   * target: (context: any) => string
   * ```
   */
  readonly target: (...args: any[]) => any;
}
