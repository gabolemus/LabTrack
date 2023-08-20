// This file contains general utility functions.

/**
 * Rounds the given number to the given number of decimal places.
 * @param num Number to round.
 * @param decimalPlaces Number of decimal places to round to.
 * @returns Rounded number.
 */
export const roundToDecimalPlaces = (
  num: number,
  decimalPlaces: number
): number => {
  const factor = 10 ** decimalPlaces;
  return Math.round(num * factor) / factor;
};
