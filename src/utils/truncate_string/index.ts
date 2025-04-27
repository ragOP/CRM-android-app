export const truncateString = (str: string, upto: number): string => {
    if (typeof str !== 'string' || typeof upto !== 'number' || upto <= 0) {
      return str;
    }
    return str.length > upto ? str.slice(0, upto) + '...' : str;
  };