import { getMetadataArgsStorage } from '../globals';
import { MetadataArgsStorage } from '../metadata-args-storage';

describe('Globals', () => {
  it('should return MetadataArgsStorage instance', () => {
    const storage = getMetadataArgsStorage();
    
    expect(storage).toBeInstanceOf(MetadataArgsStorage);
    expect(storage).toBeDefined();
  });

  it('should return same instance on multiple calls (singleton)', () => {
    const storage1 = getMetadataArgsStorage();
    const storage2 = getMetadataArgsStorage();
    
    expect(storage1).toBe(storage2);
  });

  it('should have tasks array property', () => {
    const storage = getMetadataArgsStorage();
    
    expect(storage.tasks).toBeDefined();
    expect(Array.isArray(storage.tasks)).toBe(true);
  });
}); 