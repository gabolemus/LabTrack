// This file contains general utility functions.

export const BE_URL = process.env.REACT_APP_BACKEND_URL as string;

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

/**
 * Converts a timestamp to a date string.
 * The format used is YYYY-MM-DDTHH:mm:ss.sssZ.
 * @param timestamp Timestamp to convert.
 * @returns Date string.
 */
export const timestampToDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("es-ES", { month: "long" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${day} de ${month} de ${year} a las ${time}`;
};

/**
 * Converts a timestamp to a short date string (DD/MM/YYYY).
 * The format used is YYYY-MM-DDTHH:mm:ss.sssZ.
 * @param timestamp Timestamp to convert.
 * @returns Date string.
 */
export const timestampToShortDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Converts a short date string (DD/MM/YYYY) to a timestamp.
 * The format used is YYYY-MM-DDTHH:mm:ss.sssZ.
 * @param shortDate Short date string to convert.
 * @returns Timestamp.
 */
export const shortDateToTimestamp = (shortDate: string): string => {
  const [day, month, year] = shortDate.split("/");
  return new Date(`${year}-${month}-${day}`).toISOString();
};

/**
 * Calls the callback with the given boolean and adds the `no-scroll` class to the
 * body if the boolean is true or removes it if it is false.
 * @param callback Callback to call with the boolean.
 * @param bool Boolean to pass to the callback.
 */
export const toggleLoader = (
  callback: (bool: boolean) => void,
  bool: boolean
) => {
  callback(bool);
  if (bool) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }
};

/**
 * Checks if 2 objects are equal. AKA checks if all the key-value pairs of the
 * objects are equal.
 * @param objA First object.
 * @param objB Second object.
 * @returns true if the objects are equal, false otherwise.
 */
export const areObjectsEqual = <T extends Record<string, unknown>>(
  objA: T,
  objB: T
): boolean => {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (const key of keysA) {
    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Checks if 2 arrays of objects are equal. AKA checks if all the key-value pairs
 * of the objects in the arrays are equal.
 * @param arrA First array.
 * @param arrB Second array.
 * @returns true if the arrays are equal, false otherwise.
 */
export const areArraysEqual = <T extends Record<string, unknown>>(
  arrA: Array<T>,
  arrB: Array<T>
): boolean => {
  if (arrA.length !== arrB.length) {
    return false;
  }

  for (const [index, value] of arrA.entries()) {
    if (!areObjectsEqual(value, arrB[index])) {
      return false;
    }
  }

  return true;
};

/**
 * Concatenates any amount of arrays of objects.
 * @param arrays Arrays to concatenate.
 * @returns Concatenated array.
 */
export const concatArrays = <T extends Record<string, unknown>>(
  ...arrays: Array<Array<T>>
): Array<T> => arrays.reduce((acc, curr) => acc.concat(curr), []);
