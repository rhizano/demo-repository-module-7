// Utility file with various code smells and zombie code

// Poor function naming (code smell)
export function doStuff(data: any): any {
  return JSON.parse(JSON.stringify(data));
}

// Fixed: Removed dangerous eval function - code injection vulnerability
// export function dynamicEval(expression: string): any {
//   // Dangerous use of eval (security vulnerability) - REMOVED
//   return eval(expression);
// }

// Safe alternative for specific use cases
export function parseJsonSafely(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
}

// Inconsistent error handling (code smell)
export function formatDate(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  } catch (error) {
    // Fixed: Proper error handling
    console.error('Error formatting date:', error);
    throw new Error('Invalid date format');
  }
}

// Duplicate code - similar to formatDate (code smell)
export function dateFormat(dateInput: Date | string): string {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
}

// Note: Remove duplicate dateFormat function in favor of formatDate above
// TODO: Consolidate date formatting logic
