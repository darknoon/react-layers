// @flow
import shallowEqual from 'fbjs/lib/shallowEqual';

export default function memoize<RetType, T, ArgsType: $ReadOnlyArray<T>>(
  // The function you want to be run and whose result memoized.
  // It can take any arguments and return any value
  fn: (...ArgsType) => RetType,
  // The function to use to compare the arguments of the function.
  // fn will not be re-run if this returns true
  // Arguments will be passed as an array, so if you want to check each for equality,
  // you might want to apply your equality function to each item in the array
  argumentsEqual: (ArgsType, ArgsType) => boolean = shallowEqual,
  // If resultEqual returns true on the result of fn, the cached result will be returned instead of fn(..args)
  // This helps achieve reference equality, ie oldResult === newResult even when fn builds a new structure
  resultEqual: (RetType, RetType) => boolean = shallowEqual,
): (...ArgsType) => RetType {
  let argumentCache: ArgsType;
  let resultCache: RetType;
  return (...args: ArgsType) => {
    if (argumentCache === undefined || !argumentsEqual(argumentCache, args)) {
      argumentCache = args;
      const result = fn(...args);
      if (resultCache === undefined || !resultEqual(result, resultCache)) {
        resultCache = result;
      }
    }
    return resultCache;
  };
}
