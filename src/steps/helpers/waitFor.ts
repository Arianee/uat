export const waitFor = (n = 8000): Promise<void> => new Promise(resolve => setTimeout(resolve, n));
