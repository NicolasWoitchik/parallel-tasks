import { MixedList } from 'commons/mixed-list'
import path from 'path'

export class PlatformTools {
  static getGlobalVariable(): typeof globalThis {
    return global
  }

  static pathNormalize(pathStr: string): string {
    let normalizedPath = path.normalize(pathStr)
    if (process.platform === 'win32')
      normalizedPath = normalizedPath.replace(/\\/g, '/')
    return normalizedPath
  }

  static pathResolve(pathStr: string): string {
    return path.resolve(pathStr)
  }

  static pathExtname(pathStr: string): string {
    return path.extname(pathStr)
  }

  /**
   * Split a list of classes and strings into two lists.
   * @param classesAndStrings - The list of classes and strings to split.
   * @returns A tuple containing two lists: one for classes and one for strings.
   */
  static splitClassesAndStrings<T>(
    classesAndStrings: (string | T)[],
  ): [T[], string[]] {
    return [
      classesAndStrings.filter((cls): cls is T => typeof cls !== 'string'),
      classesAndStrings.filter((str): str is string => typeof str === 'string'),
    ]
  }
  /**
   * Converts MixedList<T> to strictly an array of its T items.
   */
  static mixedListToArray<T>(list: MixedList<T>): T[] {
    if (list !== null && typeof list === 'object') {
      return Object.keys(list).map((key) => (list as { [key: string]: T })[key])
    } else {
      return list as T[]
    }
  }

  static isObject(val: unknown): val is object {
    return val !== null && typeof val === 'object'
  }
}
