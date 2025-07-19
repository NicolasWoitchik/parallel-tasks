import { FileClassLoaderService } from '../../utils/file-class-loader';

describe('FileClassLoaderService - 100% Coverage Tests', () => {
  let service: FileClassLoaderService;

  beforeEach(() => {
    service = new FileClassLoaderService();
  });

  describe('🎯 Core Functionality', () => {
    it('should extract classes from modules', () => {
      class TestClass1 {}
      class TestClass2 {}

      const modules = [
        { TestClass1, TestClass2, nonClass: 'string' },
        { default: TestClass1, another: TestClass2 }
      ];

      const result = service.loadClasses(modules);

      expect(result).toContain(TestClass1);
      expect(result).toContain(TestClass2);
      expect(result.length).toBeGreaterThanOrEqual(4); // Should find all class instances
    });

    it('should handle empty modules array', () => {
      const result = service.loadClasses([]);
      expect(result).toEqual([]);
    });

    it('should filter out non-function values', () => {
      class RealClass {}
      const fakeClass = 'not a class';
      const numberValue = 42;
      const objectValue = { key: 'value' };

      const modules = [{
        RealClass,
        fakeClass,
        numberValue,
        objectValue
      }];

      const result = service.loadClasses(modules);

      expect(result).toContain(RealClass);
      expect(result).not.toContain(fakeClass);
      expect(result).not.toContain(numberValue);
      expect(result).not.toContain(objectValue);
    });
  });

  describe('🧬 Complex Module Structures', () => {
    it('should handle deeply nested module exports', () => {
      class DeepClass {}
      
      const deepModule = {
        level1: {
          level2: {
            level3: {
              DeepClass,
              level4: {
                evenDeeper: DeepClass
              }
            }
          }
        },
        topLevel: DeepClass
      };

      const result = service.loadClasses([deepModule]);

      // Should find all instances of DeepClass at different nesting levels
      expect(result.filter(cls => cls === DeepClass).length).toBeGreaterThan(0);
      expect(result).toContain(DeepClass);
    });

    it('should handle arrays within modules', () => {
      class ArrayClass {}
      
      const moduleWithArray = {
        normalClass: ArrayClass,
        classArray: [ArrayClass, ArrayClass],
        mixedArray: [ArrayClass, 'string', 42]
      };

      const result = service.loadClasses([moduleWithArray]);

      expect(result).toContain(ArrayClass);
      // Should find ArrayClass multiple times from different locations
      expect(result.filter(cls => cls === ArrayClass).length).toBeGreaterThan(1);
    });

             it('should handle circular references by avoiding them', () => {
      class CircularClass {}
      
      // Create a truly circular reference that will be detected
      const moduleA: any = {
        CircularClass,
        exports: null
      };
      const moduleB: any = {
        reference: moduleA,
        anotherClass: class AnotherClass {}
      };
      moduleA.exports = moduleB; // Create circular reference
      
      // This tests the visited.has(exported) check
      const result = service.loadClasses([moduleA]);
      expect(result).toContain(CircularClass);
      expect(result).toContain(moduleB.anotherClass);
    });
  });

  describe('🐛 Edge Cases & Error Handling', () => {
    it('should handle null and undefined modules', () => {
      const modules = [null, undefined, {}, { validClass: class ValidClass {} }];

      expect(() => service.loadClasses(modules)).not.toThrow();
      
      const result = service.loadClasses(modules);
      expect(result.length).toBeGreaterThan(0); // Should find the valid class
    });

    it('should handle mixed primitive and object values', () => {
      class RealClass {}
      
      const mixedModule = {
        RealClass,
        stringValue: 'not a class',
        numberValue: 42,
        booleanValue: true,
        nullValue: null,
        undefinedValue: undefined,
        symbolValue: Symbol('test'),
        dateValue: new Date(),
        arrayValue: [RealClass],
        functionValue: () => 'not a constructor'
      };

      const result = service.loadClasses([mixedModule]);
      
      expect(result).toContain(RealClass);
      expect(result.filter(cls => typeof cls === 'function').length).toBeGreaterThan(0);
    });

    it('should handle empty objects', () => {
      const emptyModule = {};
      const result = service.loadClasses([emptyModule]);
      expect(result).toEqual([]);
    });

    it('should handle modules with only non-class exports', () => {
      const nonClassModule = {
        string: 'value',
        number: 42,
        boolean: true,
        object: { nested: 'value' },
        array: [1, 2, 3]
      };

      const result = service.loadClasses([nonClassModule]);
      expect(result).toEqual([]);
    });
  });

  describe('⚡ Performance & Memory Tests', () => {
    it('should handle large modules efficiently', () => {
      const largeModule: any = {};
      const realClasses: any[] = [];
      
      // Create 1000 properties with mixed types
      for (let i = 0; i < 1000; i++) {
        if (i % 10 === 0) {
          // Every 10th property is a real class
          const className = `TestClass${i}`;
          const testClass = class {};
          Object.defineProperty(testClass, 'name', { value: className });
          largeModule[className] = testClass;
          realClasses.push(testClass);
        } else {
          // Fill with non-class values
          largeModule[`prop${i}`] = `value${i}`;
        }
      }

      const startTime = performance.now();
      const result = service.loadClasses([largeModule]);
      const endTime = performance.now();

      expect(result.length).toBeGreaterThan(0);
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
      
      // Verify all real classes were found
      realClasses.forEach(cls => {
        expect(result).toContain(cls);
      });
    });

    it('should handle repeated operations efficiently', () => {
      class TestClass {}
      
      const module = { TestClass, nonClass: 'string' };

      const startTime = performance.now();

      // Perform many operations
      for (let i = 0; i < 100; i++) {
        service.loadClasses([module]);
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
    });
  });

  describe('🎭 Real-world Scenarios', () => {
    it('should handle typical module patterns', () => {
      // Simulate typical exported modules
      class UserService {}
      class DataValidator {}
      const helperFunction = () => {};
      const CONFIG = { apiUrl: 'https://api.example.com' };

      const typicalModule = {
        UserService,
        DataValidator,
        helpers: {
          helperFunction,
          anotherHelper: () => {}
        },
        config: CONFIG,
        constants: {
          VERSION: '1.0.0'
        }
      };

      const result = service.loadClasses([typicalModule]);

      expect(result).toContain(UserService);
      expect(result).toContain(DataValidator);
      expect(result).toContain(helperFunction);
             expect(result.filter(item => typeof item === 'function').length).toBe(4);
    });

    it('should handle ES6 modules with default and named exports', () => {
      class DefaultExport {}
      class NamedExport1 {}
      class NamedExport2 {}

      const es6Module = {
        default: DefaultExport,
        NamedExport1,
        NamedExport2,
        __esModule: true
      };

      const result = service.loadClasses([es6Module]);

      expect(result).toContain(DefaultExport);
      expect(result).toContain(NamedExport1);
      expect(result).toContain(NamedExport2);
    });

    it('should handle CommonJS modules', () => {
      class CommonJSClass {}
      
      const cjsModule = {
        exports: {
          CommonJSClass,
          helper: function() { return 'help'; }
        }
      };

      const result = service.loadClasses([cjsModule]);

      expect(result).toContain(CommonJSClass);
      expect(result.filter(item => typeof item === 'function').length).toBe(2);
    });

    it('should handle modules with constructor functions', () => {
             function ConstructorFunction(this: any) {
         this.property = 'value';
       }
      
      class ModernClass {
        property = 'value';
      }

      const module = {
        ConstructorFunction,
        ModernClass,
        ArrowFunction: () => {},
        RegularFunction: function() { return 'regular'; }
      };

      const result = service.loadClasses([module]);

      expect(result).toContain(ConstructorFunction);
      expect(result).toContain(ModernClass);
      expect(result.length).toBe(4); // All functions should be included
    });

    it('should handle inheritance hierarchies', () => {
      class BaseClass {}
      class ExtendedClass extends BaseClass {}
      class FurtherExtendedClass extends ExtendedClass {}

      const hierarchyModule = {
        BaseClass,
        ExtendedClass,
        FurtherExtendedClass
      };

      const result = service.loadClasses([hierarchyModule]);

      expect(result).toContain(BaseClass);
      expect(result).toContain(ExtendedClass);
      expect(result).toContain(FurtherExtendedClass);
      expect(result.length).toBe(3);
    });
  });
}); 