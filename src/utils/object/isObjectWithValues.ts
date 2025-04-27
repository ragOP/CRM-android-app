export const isObjectWithValues = (
  obj: unknown,
): obj is Record<string, unknown> => {
  return (
    !!obj &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    Object.keys(obj).length > 0
  );
};
