/**
 * override a method on this object by minimum `overrideTime`
 * @param object object which has the method you're overriding
 * @param method the name of the method to override
 * @param callback the new implementation of the method
 */
export function override<
  TObject extends { [key in TMethod]: (...args: any[]) => any },
  TMethod extends string
>(
  object: TObject,
  method: TMethod,
  callback: (
    methodFn: TObject[TMethod],
    ...args: Parameters<typeof object[TMethod]>
  ) => ReturnType<typeof object[TMethod]> = (methodFn, ...args) =>
    methodFn(...args)
): TObject {
  return Object.assign({}, object, {
    [method](
      ...args: Parameters<typeof object[TMethod]>
    ): ReturnType<typeof object[TMethod]> {
      return callback(object[method], ...args);
    },
  });
}
