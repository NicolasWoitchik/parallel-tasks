import { MixedList } from 'commons/mixed-list'
import { PlatformTools } from '../tools'

describe('PlatformTools', () => {
  describe('getGlobalVariable', () => {
    it('should return global object', () => {
      const result = PlatformTools.getGlobalVariable()
      expect(result).toBe(global)
    })
  })

  describe('pathNormalize', () => {
    it('should normalize path', () => {
      const result = PlatformTools.pathNormalize('./src//file.ts')
      expect(result).toBe('src/file.ts')
    })

    it('should handle Windows paths on Windows platform', () => {
      const originalPlatform = process.platform
      Object.defineProperty(process, 'platform', {
        value: 'win32'
      })

      const result = PlatformTools.pathNormalize('.\\src\\\\file.ts')
      expect(result).toBe('./src//file.ts')

      // Restore original platform
      Object.defineProperty(process, 'platform', {
        value: originalPlatform
      })
    })
  })

  describe('pathResolve', () => {
    it('should resolve path', () => {
      const result = PlatformTools.pathResolve('./src/file.ts')
      expect(result).toMatch(/.*src\/file\.ts$/)
    })
  })

  describe('pathExtname', () => {
    it('should extract extension', () => {
      const result = PlatformTools.pathExtname('file.ts')
      expect(result).toBe('.ts')
    })

    it('should handle files without extension', () => {
      const result = PlatformTools.pathExtname('file')
      expect(result).toBe('')
    })
  })

  describe('splitClassesAndStrings', () => {
    it('should split mixed array correctly', () => {
      class TestClass {}
      const mixed = [TestClass, 'string1', 'string2']

      const [classes, strings] = PlatformTools.splitClassesAndStrings(mixed)

      expect(classes).toEqual([TestClass])
      expect(strings).toEqual(['string1', 'string2'])
    })

    it('should handle empty array', () => {
      const [classes, strings] = PlatformTools.splitClassesAndStrings([])

      expect(classes).toEqual([])
      expect(strings).toEqual([])
    })
  })

  describe('mixedListToArray', () => {
    it('should handle object form of MixedList', () => {
      const objectList = { a: 'item1', b: 'item2', c: 'item3' }
      const result = PlatformTools.mixedListToArray(objectList)

      expect(result).toEqual(['item1', 'item2', 'item3'])
    })

    it('should handle array form of MixedList', () => {
      const arrayList = ['item1', 'item2', 'item3']
      const result = PlatformTools.mixedListToArray(arrayList)

      expect(result).toEqual(['item1', 'item2', 'item3'])
    })

    it('should handle null and undefined', () => {
      const nullResult = PlatformTools.mixedListToArray(null as unknown as MixedList<unknown>)
      expect(nullResult).toBeNull()

      const undefinedResult = PlatformTools.mixedListToArray(undefined as unknown as MixedList<unknown>)
      expect(undefinedResult).toBeUndefined()
    })
  })

  describe('isObject', () => {
    it('should identify objects correctly', () => {
      expect(PlatformTools.isObject({})).toBe(true)
      expect(PlatformTools.isObject([])).toBe(true)
      expect(PlatformTools.isObject(new Date())).toBe(true)
    })

    it('should reject non-objects', () => {
      expect(PlatformTools.isObject(null)).toBe(false)
      expect(PlatformTools.isObject(undefined)).toBe(false)
      expect(PlatformTools.isObject('string')).toBe(false)
      expect(PlatformTools.isObject(42)).toBe(false)
      expect(PlatformTools.isObject(true)).toBe(false)
    })
  })
})