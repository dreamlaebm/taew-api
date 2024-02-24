export function pickKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const picked: Partial<Pick<T, K>> = {}; // Partial is used because we'll build it gradually
  keys.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      picked[key] = obj[key];
    }
  });
  return picked as Pick<T, K>; // We assert the type to Pick<T, K> as it's safe
}
