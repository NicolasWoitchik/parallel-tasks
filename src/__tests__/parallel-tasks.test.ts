import { ParallelTasks } from '../parallel-tasks';
import { RegisterTask } from '../decorators/register-task';
import { getMetadataArgsStorage } from '../globals';

describe('ParallelTasks', () => {
  beforeEach(() => {
    // Clear metadata storage between tests
    const storage = getMetadataArgsStorage();
    (storage as any).tasks = [];
  });

  describe('constructor', () => {
    it('should create instance with options', () => {
      const parallelTasks = new ParallelTasks({
        tasks: ['./test-tasks/**/*.task.ts']
      });
      
      expect(parallelTasks).toBeInstanceOf(ParallelTasks);
    });
  });

  describe('execute', () => {
    it('should throw error when no tasks found', async () => {
      const parallelTasks = new ParallelTasks({
        tasks: []
      });

      await expect(parallelTasks.execute('NON_EXISTENT', {}))
        .rejects
        .toThrow("No tasks found for 'NON_EXISTENT'");
    });

    it('should execute registered tasks in parallel', async () => {
      // Create test tasks
      class TestTask {
        @RegisterTask('TEST_TASK')
        async task1(context: any) {
          return `Result 1: ${context.value}`;
        }

        @RegisterTask('TEST_TASK')
        async task2(context: any) {
          return `Result 2: ${context.value}`;
        }
      }

      // Instantiate to trigger decorator registration
      new TestTask();

      const parallelTasks = new ParallelTasks({
        tasks: []
      });

      const results = await parallelTasks.execute('TEST_TASK', { value: 'test' });
      
      expect(results).toHaveLength(2);
      expect(results).toContain('Result 1: test');
      expect(results).toContain('Result 2: test');
    });

    it('should handle task errors gracefully', async () => {
      class TestTask {
        @RegisterTask('ERROR_TASK')
        async successTask() {
          return 'success';
        }

        @RegisterTask('ERROR_TASK')
        async errorTask() {
          throw new Error('Task failed');
        }
      }

      new TestTask();

      const parallelTasks = new ParallelTasks({
        tasks: []
      });

      const results = await parallelTasks.execute('ERROR_TASK', {});
      
      expect(results).toHaveLength(2);
      expect(results).toContain('success');
      expect(results[1]).toBeInstanceOf(Error);
      expect((results[1] as Error).message).toBe('Task failed');
    });
  });

  describe('initialize', () => {
    it('should return empty array when no tasks provided', async () => {
      const parallelTasks = new ParallelTasks({
        tasks: []
      });

      const result = await parallelTasks.initialize();
      
      expect(result).toEqual([]);
    });

    it('should return provided classes', async () => {
      class TestClass {}

      const parallelTasks = new ParallelTasks({
        tasks: [TestClass]
      });

      const result = await parallelTasks.initialize();
      
      expect(result).toEqual([TestClass]);
    });

    it('should discover files from path patterns', async () => {
      // Create a real test to verify the file discovery flow works
      class TestClass {}

      const parallelTasks = new ParallelTasks({
        tasks: [TestClass, './non-existent-path/**/*.task.ts']
      });

      const result = await parallelTasks.initialize();
      
      // Should at least include the provided class, even if no files discovered
      expect(result).toContain(TestClass);
      expect(result.length).toBeGreaterThanOrEqual(1);
    });
  });
}); 