export const validateUsername = (value: string): string | null => {
  if (!value.trim()) {
    return 'Username is required';
  }

  if (value.length < 1 || value.length > 39) {
    return 'Username must be between 1 and 39 characters';
  }

  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(value)) {
    return 'Username may only contain alphanumeric characters and hyphens, and cannot begin or end with a hyphen';
  }

  return null; 
};