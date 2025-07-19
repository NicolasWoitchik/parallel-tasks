import { ModuleImportService } from '../../utils/module-import'
import { importOrRequireFile } from '../../utils/import-utils'
import path from 'path'

// Mock the import utility
jest.mock('../../utils/import-utils')

const mockImportOrRequireFile = importOrRequireFile as jest.MockedFunction<typeof importOrRequireFile>

describe('ModuleImportService - 100% Coverage Tests', () => {
  let service: ModuleImportService

  beforeEach(() => {
    service = new ModuleImportService()
    jest.clearAllMocks()
  })

  describe('🎯 Core Functionality', () => {
    it('should import multiple modules successfully', async () => {
      const mockModules = [
        { export1: 'value1' },
        { export2: 'value2' },
        { export3: 'value3' }
      ]

      mockImportOrRequireFile
        .mockResolvedValueOnce([mockModules[0], 'esm'])
        .mockResolvedValueOnce([mockModules[1], 'esm'])
        .mockResolvedValueOnce([mockModules[2], 'esm'])

      const filePaths = ['./file1.ts', './file2.ts', './file3.ts']
      const result = await service.importModules(filePaths)

      expect(result).toEqual(mockModules)
      expect(mockImportOrRequireFile).toHaveBeenCalledTimes(3)
      filePaths.forEach(filePath => {
        const expectedPath = path.resolve(filePath)
        expect(mockImportOrRequireFile).toHaveBeenCalledWith(expectedPath)
      })
    })

    it('should handle empty file paths array', async () => {
      const result = await service.importModules([])
      expect(result).toEqual([])
      expect(mockImportOrRequireFile).not.toHaveBeenCalled()
    })

    it('should handle single module import', async () => {
      const mockModule = { singleExport: 'value' }
      mockImportOrRequireFile.mockResolvedValueOnce([mockModule, 'commonjs'])

      const result = await service.importModules(['./single.ts'])

      expect(result).toEqual([mockModule])
      const expectedPath = path.resolve('./single.ts')
      expect(mockImportOrRequireFile).toHaveBeenCalledWith(expectedPath)
    })
  })

  describe('🔥 Error Handling & Edge Cases', () => {
    it('should handle import failures gracefully', async () => {
      const successModule = { success: true }
      const importError = new Error('Module not found')

      mockImportOrRequireFile
        .mockResolvedValueOnce([successModule, 'esm'])
        .mockRejectedValueOnce(importError)
        .mockResolvedValueOnce([successModule, 'esm'])

      const filePaths = ['./success1.ts', './failure.ts', './success2.ts']
      const result = await service.importModules(filePaths)

      // Should contain successful imports and filter out failed ones
      expect(result).toHaveLength(2)
      expect(result.filter(mod => mod && mod.success)).toHaveLength(2)
    })

    it('should handle mixed module types (ESM and CommonJS)', async () => {
      const esmModule = { type: 'esm' }
      const cjsModule = { type: 'commonjs' }

      mockImportOrRequireFile
        .mockResolvedValueOnce([esmModule, 'esm'])
        .mockResolvedValueOnce([cjsModule, 'commonjs'])

      const result = await service.importModules(['./esm.mjs', './cjs.js'])

      expect(result).toEqual([esmModule, cjsModule])
    })

    it('should handle null and undefined modules', async () => {
      mockImportOrRequireFile
        .mockResolvedValueOnce([null, 'esm'])
        .mockResolvedValueOnce([undefined, 'esm'])
        .mockResolvedValueOnce([{ valid: true }, 'esm'])

      const result = await service.importModules(['./null.ts', './undefined.ts', './valid.ts'])

      expect(result).toHaveLength(3)
      expect(result[0]).toBeNull()
      expect(result[1]).toBeUndefined()
      expect(result[2]).toEqual({ valid: true })
    })

    it('should handle various error types', async () => {
      const validModule = { working: true }

      mockImportOrRequireFile
        .mockRejectedValueOnce(new SyntaxError('Invalid syntax'))
        .mockRejectedValueOnce(new TypeError('Type error'))
        .mockRejectedValueOnce(new ReferenceError('Reference error'))
        .mockResolvedValueOnce([validModule, 'esm'])

      const filePaths = ['./syntax-error.ts', './type-error.ts', './ref-error.ts', './valid.ts']
      const result = await service.importModules(filePaths)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(validModule)
    })
  })

  describe('⚡ Performance Tests', () => {
    it('should handle many modules efficiently', async () => {
      const moduleCount = 100
      const filePaths = Array.from({ length: moduleCount }, (_, i) => `./module${i}.ts`)

      // Mock all imports to succeed
      for (let i = 0; i < moduleCount; i++) {
        mockImportOrRequireFile.mockResolvedValueOnce([{ id: i, name: `module${i}` }, 'esm'])
      }

      const startTime = performance.now()
      const result = await service.importModules(filePaths)
      const endTime = performance.now()

      expect(result).toHaveLength(moduleCount)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete quickly
    })

    it('should maintain order of imports', async () => {
      const modules = [
        { order: 1, name: 'first' },
        { order: 2, name: 'second' },
        { order: 3, name: 'third' }
      ]

      modules.forEach(module => {
        mockImportOrRequireFile.mockResolvedValueOnce([module, 'esm'])
      })

      const result = await service.importModules(['./first.ts', './second.ts', './third.ts'])

      expect(result[0]).toEqual(modules[0])
      expect(result[1]).toEqual(modules[1])
      expect(result[2]).toEqual(modules[2])
    })
  })

  describe('🌐 Integration Scenarios', () => {
    it('should work with relative and absolute paths', async () => {
      const relativeModule = { type: 'relative' }
      const absoluteModule = { type: 'absolute' }

      mockImportOrRequireFile
        .mockResolvedValueOnce([relativeModule, 'esm'])
        .mockResolvedValueOnce([absoluteModule, 'esm'])

      const result = await service.importModules(['./relative.ts', '/absolute/path/file.ts'])

      expect(result).toEqual([relativeModule, absoluteModule])
    })

    it('should handle different file extensions', async () => {
      const extensions = ['.ts', '.js', '.mjs', '.cjs']
      const modules = extensions.map((ext, i) => ({ extension: ext, id: i }))

      modules.forEach(module => {
        mockImportOrRequireFile.mockResolvedValueOnce([module, 'esm'])
      })

      const filePaths = extensions.map(ext => `./file${ext}`)
      const result = await service.importModules(filePaths)

      expect(result).toEqual(modules)
    })

    it('should handle concurrent imports without race conditions', async () => {
      const concurrentCount = 50
      const modules = Array.from({ length: concurrentCount }, (_, i) => ({ id: i }))

      modules.forEach(module => {
        mockImportOrRequireFile.mockResolvedValueOnce([module, 'esm'])
      })

      const filePaths = Array.from({ length: concurrentCount }, (_, i) => `./concurrent${i}.ts`)

      // Execute multiple import operations simultaneously
      const promises = [
        service.importModules(filePaths.slice(0, 10)),
        service.importModules(filePaths.slice(10, 20)),
        service.importModules(filePaths.slice(20, 30)),
        service.importModules(filePaths.slice(30, 40)),
        service.importModules(filePaths.slice(40, 50))
      ]

      const results = await Promise.all(promises)

      // Verify all batches completed successfully
      results.forEach(batch => {
        expect(batch).toHaveLength(10)
        batch.forEach(module => {
          expect(module).toHaveProperty('id')
          expect(typeof module.id).toBe('number')
        })
      })
    })
  })

  describe('🎭 Mock & Test Scenarios', () => {
    it('should handle modules with various export patterns', async () => {
      const defaultExportModule = { default: 'defaultValue' }
      const namedExportsModule = { export1: 'named1', export2: 'named2' }
      const mixedExportsModule = { default: 'default', named: 'named' }
      const emptyModule = {}

      mockImportOrRequireFile
        .mockResolvedValueOnce([defaultExportModule, 'esm'])
        .mockResolvedValueOnce([namedExportsModule, 'esm'])
        .mockResolvedValueOnce([mixedExportsModule, 'esm'])
        .mockResolvedValueOnce([emptyModule, 'esm'])

      const result = await service.importModules([
        './default.ts',
        './named.ts',
        './mixed.ts',
        './empty.ts'
      ])

      expect(result).toEqual([
        defaultExportModule,
        namedExportsModule,
        mixedExportsModule,
        emptyModule
      ])
    })

    it('should handle complex module objects', async () => {
      const complexModule = {
        classes: { UserClass: class {}, DataClass: class {} },
        functions: { helper: () => {}, validator: () => {} },
        constants: { VERSION: '1.0.0', API_URL: 'http://api.example.com' },
        nested: {
          deep: {
            value: 'deeply nested'
          }
        }
      }

      mockImportOrRequireFile.mockResolvedValueOnce([complexModule, 'esm'])

      const result = await service.importModules(['./complex.ts'])

      expect(result[0]).toBe(complexModule)
      expect(result[0].classes).toBeDefined()
      expect(result[0].functions).toBeDefined()
      expect(result[0].constants).toBeDefined()
      expect(result[0].nested.deep.value).toBe('deeply nested')
    })
  })
})