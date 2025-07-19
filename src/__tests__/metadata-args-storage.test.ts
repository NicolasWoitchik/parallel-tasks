import { MetadataArgsStorage } from '../metadata-args-storage'

describe('MetadataArgsStorage', () => {
  let storage: MetadataArgsStorage

  beforeEach(() => {
    storage = new MetadataArgsStorage()
  })

  it('should create instance with empty tasks array', () => {
    expect(storage.tasks).toBeDefined()
    expect(Array.isArray(storage.tasks)).toBe(true)
    expect(storage.tasks).toHaveLength(0)
  })

  it('should allow adding tasks to the array', () => {
    const mockTask = {
      taskName: 'TEST_TASK',
      target: () => 'test'
    }

    storage.tasks.push(mockTask)

    expect(storage.tasks).toHaveLength(1)
    expect(storage.tasks[0]).toBe(mockTask)
  })

  it('should maintain tasks array state', () => {
    const task1 = { taskName: 'TASK_1', target: () => 'task1' }
    const task2 = { taskName: 'TASK_2', target: () => 'task2' }

    storage.tasks.push(task1, task2)

    expect(storage.tasks).toHaveLength(2)
    expect(storage.tasks[0]).toBe(task1)
    expect(storage.tasks[1]).toBe(task2)
  })
})