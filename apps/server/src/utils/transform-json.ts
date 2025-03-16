/**
 * Transforms a JSON string or object into a parsed object
 * Handles both cases where the value is already an object or a JSON string
 */
export function transformJsonQuery<T>(value: string | object | undefined): T | undefined {
  if (!value) {
    return undefined;
  }

  // If it's already an object, return it
  if (typeof value === 'object') {
    return value as T;
  }

  try {
    // Parse the JSON string
    return JSON.parse(value) as T;
  } catch {
    // If parsing fails, return undefined
    console.error('Failed to parse JSON query parameter:', value);
    return undefined;
  }
}
