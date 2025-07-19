import { MetadataArgsStorage } from './metadata-args-storage'
import { PlatformTools } from './tools'

export function getMetadataArgsStorage(): MetadataArgsStorage {
  const globalScope = PlatformTools.getGlobalVariable()
  
  if (!globalScope.parallelTasksMetadataArgsStorage) 
    globalScope.parallelTasksMetadataArgsStorage = new MetadataArgsStorage()  

  return globalScope.parallelTasksMetadataArgsStorage
}
