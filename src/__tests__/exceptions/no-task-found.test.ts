import { NoTaskFoundException } from '../../exceptions/no-task-found.exeption'

describe('NoTaskFoundException', () => {
  it('should create instance with message', () => {
    const taskName = 'TEST_TASK'
    const exception = new NoTaskFoundException(taskName)
    
    expect(exception).toBeInstanceOf(Error)
    expect(exception).toBeInstanceOf(NoTaskFoundException)
    expect(exception.message).toBe(`No tasks found for '${taskName}'`)
  })

  it('should have correct name property', () => {
    const exception = new NoTaskFoundException('test')
    expect(exception.name).toBe('NoTaskFoundException')
  })

  it('should be throwable', () => {
    expect(() => {
      throw new NoTaskFoundException('TEST_TASK')
    }).toThrow('No tasks found for \'TEST_TASK\'')
  })

  it('should work with try-catch', () => {
    const taskName = 'CUSTOM_TASK'
    
    try {
      throw new NoTaskFoundException(taskName)
    } catch (error) {
      expect(error).toBeInstanceOf(NoTaskFoundException)
      expect((error as NoTaskFoundException).message).toBe(`No tasks found for '${taskName}'`)
    }
  })
}) 