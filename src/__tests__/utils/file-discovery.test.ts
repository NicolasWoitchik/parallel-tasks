import { FileDiscoveryService } from '../../utils/file-discovery';

// Mock glob to prevent actual file system access
jest.mock('glob', () => ({
  sync: jest.fn()
}));

const glob = require('glob');
const mockGlobSync = glob.sync as jest.MockedFunction<typeof glob.sync>;

describe('FileDiscoveryService - Essential Tests', () => {
  let service: FileDiscoveryService;
  
  beforeEach(() => {
    service = new FileDiscoveryService();
    jest.clearAllMocks();
  });

  describe('🎯 Core Functionality', () => {
    it('should discover files from glob patterns', () => {
      const mockPaths = ['/mock/path1.ts', '/mock/path2.ts', '/mock/other.txt'];
      mockGlobSync.mockReturnValue(mockPaths);

      const result = service.discoverFiles(['./src/**/*.ts']);

      expect(result).toEqual(['/mock/path1.ts', '/mock/path2.ts']);
      expect(mockGlobSync).toHaveBeenCalledWith('src/**/*.ts');
    });

    it('should handle empty patterns array', () => {
      const result = service.discoverFiles([]);
      expect(result).toEqual([]);
      expect(mockGlobSync).not.toHaveBeenCalled();
    });

    it('should filter out non-supported file extensions', () => {
      const mixedFiles = [
        '/path/valid.ts',
        '/path/valid.js',
        '/path/invalid.txt',
        '/path/invalid.json',
        '/path/valid.mjs'
      ];
      mockGlobSync.mockReturnValue(mixedFiles);

      const result = service.discoverFiles(['./src/**/*']);

      expect(result).toEqual(['/path/valid.ts', '/path/valid.js', '/path/valid.mjs']);
    });

    it('should handle multiple glob patterns', () => {
      mockGlobSync
        .mockReturnValueOnce(['/pattern1/file1.ts'])
        .mockReturnValueOnce(['/pattern2/file2.js']);

      const result = service.discoverFiles(['./pattern1/**/*.ts', './pattern2/**/*.js']);

      expect(result).toEqual(['/pattern1/file1.ts', '/pattern2/file2.js']);
      expect(mockGlobSync).toHaveBeenCalledTimes(2);
    });
  });

  describe('🔥 Edge Cases', () => {
    it('should handle null patterns gracefully', () => {
      expect(() => service.discoverFiles(null as any)).toThrow();
    });

    it('should handle undefined patterns gracefully', () => {
      expect(() => service.discoverFiles(undefined as any)).toThrow();
    });

    it('should handle empty glob results', () => {
      mockGlobSync.mockReturnValue([]);

      const result = service.discoverFiles(['./empty/**/*.ts']);

      expect(result).toEqual([]);
    });

    it('should handle patterns that return undefined paths', () => {
      mockGlobSync.mockReturnValue([undefined, '/valid/path.ts', null] as any);

      const result = service.discoverFiles(['./mixed/**/*.ts']);

      expect(result).toEqual(['/valid/path.ts']);
    });
  });

  describe('⚡ Performance', () => {
    it('should handle many patterns efficiently', () => {
      const manyPatterns = Array.from({ length: 100 }, (_, i) => `./pattern${i}/**/*.ts`);
      
      manyPatterns.forEach(() => {
        mockGlobSync.mockReturnValueOnce(['/some/file.ts']);
      });

      const startTime = performance.now();
      const result = service.discoverFiles(manyPatterns);
      const endTime = performance.now();

      expect(result).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });

    it('should handle large result sets efficiently', () => {
      const largeResultSet = Array.from({ length: 1000 }, (_, i) => `/file${i}.ts`);
      mockGlobSync.mockReturnValue(largeResultSet);

      const startTime = performance.now();
      const result = service.discoverFiles(['./large/**/*.ts']);
      const endTime = performance.now();

      expect(result).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('🎯 File Extension Filtering', () => {
    it('should support TypeScript extensions', () => {
      mockGlobSync.mockReturnValue(['/file.ts', '/file.tsx']);
      
      const result = service.discoverFiles(['./src/**/*']);
      
      expect(result).toEqual(['/file.ts', '/file.tsx']);
    });

    it('should support JavaScript extensions', () => {
      mockGlobSync.mockReturnValue(['/file.js', '/file.jsx', '/file.mjs']);
      
      const result = service.discoverFiles(['./src/**/*']);
      
      expect(result).toEqual(['/file.js', '/file.jsx', '/file.mjs']);
    });

    it('should filter out unsupported extensions', () => {
      mockGlobSync.mockReturnValue([
        '/file.ts',    // ✅ supported
        '/file.txt',   // ❌ not supported
        '/file.json',  // ❌ not supported
        '/file.js',    // ✅ supported
        '/file.py',    // ❌ not supported
        '/file.jsx'    // ✅ supported
      ]);
      
      const result = service.discoverFiles(['./src/**/*']);
      
      expect(result).toEqual(['/file.ts', '/file.js', '/file.jsx']);
    });
  });

  describe('🌐 Real-world Scenarios', () => {
    it('should work with typical project structure', () => {
      const srcFiles = [
        '/src/components/Button.tsx',
        '/src/utils/helpers.ts',
        '/src/services/api.ts',
      ];
      const testFiles = [
        '/tests/button.test.ts'
      ];
      
      mockGlobSync
        .mockReturnValueOnce(srcFiles)
        .mockReturnValueOnce(testFiles);

      const result = service.discoverFiles(['./src/**/*.{ts,tsx}', './tests/**/*.ts']);

      expect(result).toEqual([
        '/src/components/Button.tsx',
        '/src/utils/helpers.ts', 
        '/src/services/api.ts',
        '/tests/button.test.ts'
      ]);
    });

    it('should filter out TypeScript definition files', () => {
      const files = [
        '/src/types.d.ts',
        '/src/global.d.ts', 
        '/src/valid.ts',
        '/lib/external.d.ts'
      ];
      mockGlobSync.mockReturnValue(files);

      const result = service.discoverFiles(['./src/**/*.ts']);

      expect(result).toEqual(['/src/valid.ts']);
    });

    it('should handle mixed valid and definition files', () => {
      const mixedFiles = [
        '/src/component.tsx',     // valid
        '/src/types.d.ts',        // should be filtered
        '/src/utils.ts',          // valid  
        '/src/index.d.ts',        // should be filtered
        '/src/api.js',            // valid
        '/src/global.d.ts'        // should be filtered
      ];
      mockGlobSync.mockReturnValue(mixedFiles);

      const result = service.discoverFiles(['./src/**/*']);

      // Should only include valid files, filtering out all .d.ts files
      expect(result).toEqual([
        '/src/component.tsx',
        '/src/utils.ts', 
        '/src/api.js'
      ]);
      expect(result).not.toContain('/src/types.d.ts');
      expect(result).not.toContain('/src/index.d.ts');
      expect(result).not.toContain('/src/global.d.ts');
    });
  });
}); 