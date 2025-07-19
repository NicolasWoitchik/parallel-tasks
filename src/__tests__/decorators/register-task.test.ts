import { RegisterTask } from '../../decorators/register-task';
import { getMetadataArgsStorage } from '../../globals';

describe('RegisterTask Decorator', () => {
  beforeEach(() => {
    // Clear metadata storage between tests
    const storage = getMetadataArgsStorage();
    (storage as any).tasks = [];
  });

  it('should register task in metadata storage', () => {
    class TestClass {
      @RegisterTask('TEST_TASK')
      async testMethod() {
        return 'test result';
      }
    }

    const testInstance = new TestClass();
    const storage = getMetadataArgsStorage();

    expect(storage.tasks).toHaveLength(1);
    expect(storage.tasks[0]).toEqual({
      taskName: 'TEST_TASK',
      target: testInstance.testMethod
    });
  });

  it('should register multiple tasks with same name', () => {
    class TestClass {
      @RegisterTask('SHARED_TASK')
      async method1() {
        return 'result 1';
      }

      @RegisterTask('SHARED_TASK')
      async method2() {
        return 'result 2';
      }
    }

    new TestClass();
    const storage = getMetadataArgsStorage();

    expect(storage.tasks).toHaveLength(2);
    expect(storage.tasks[0].taskName).toBe('SHARED_TASK');
    expect(storage.tasks[1].taskName).toBe('SHARED_TASK');
  });

  it('should register tasks with different names', () => {
    class TestClass {
      @RegisterTask('TASK_ONE')
      async methodOne() {
        return 'result 1';
      }

      @RegisterTask('TASK_TWO')
      async methodTwo() {
        return 'result 2';
      }
    }

    new TestClass();
    const storage = getMetadataArgsStorage();

    expect(storage.tasks).toHaveLength(2);
    expect(storage.tasks[0].taskName).toBe('TASK_ONE');
    expect(storage.tasks[1].taskName).toBe('TASK_TWO');
  });
}); 