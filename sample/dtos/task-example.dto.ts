/**
 * Data Transfer Object for task execution requests in the sample implementation.
 * 
 * Represents the input data structure for example tasks demonstrating
 * payment validation workflows.
 * 
 * @public
 * @class TaskExampleRequestDTO
 * 
 * @example
 * ```typescript
 * const request: TaskExampleRequestDTO = {
 *   pixKey: '11999887766',
 *   amount: 15000 // R$ 150,00 in cents
 * };
 * 
 * const results = await parallelTasks.execute('PAYMENT_VALIDATION', request);
 * ```
 */
export class TaskExampleRequestDTO {
  /**
   * PIX key for payment identification.
   * 
   * Can be a phone number, email, CPF, CNPJ, or random key.
   * Used for validating payment recipient information.
   * 
   * @example
   * ```typescript
   * pixKey: '11999887766'    // Phone
   * pixKey: 'user@email.com' // Email
   * pixKey: '12345678901'    // CPF
   * ```
   */
  pixKey: string;

  /**
   * Payment amount in cents.
   * 
   * Always expressed in the smallest currency unit (cents for BRL)
   * to avoid floating-point precision issues in financial calculations.
   * 
   * @example
   * ```typescript
   * amount: 15000  // R$ 150,00
   * amount: 1      // R$ 0,01
   * amount: 100    // R$ 1,00
   * ```
   */
  amount: number;
}

/**
 * Data Transfer Object for task execution responses in the sample implementation.
 * 
 * Represents the output structure returned by example tasks after processing
 * payment validation workflows.
 * 
 * @public
 * @class TaskExampleResponseDTO
 * 
 * @example
 * ```typescript
 * const response: TaskExampleResponseDTO = {
 *   message: 'Payment validation completed successfully'
 * };
 * ```
 */
export class TaskExampleResponseDTO {
  /**
   * Human-readable message describing the task execution result.
   * 
   * Provides contextual information about what the task accomplished,
   * including success confirmations or descriptive error details.
   * 
   * @example
   * ```typescript
   * message: 'PIX key validation completed'
   * message: 'Amount validation failed: exceeds daily limit'
   * message: 'Payment processed successfully'
   * ```
   */
  message: string;
}