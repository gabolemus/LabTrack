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

/**
 * Converts a timestamp to a date string.
 * The format used is YYYY-MM-DDTHH:mm:ss.sssZ.
 * @param timestamp Timestamp to convert.
 * @returns Date string.
 */
export const timestampToDate = (timestamp: string): string => {
  // E.g. 2021-08-01T12:00:00.000Z --> 1 de agosto de 2021 a las 12:00:00
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

// TODO: read an environment file to get the IP address of the server

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
const areObjectsEqual = <T extends Record<string, unknown>>(
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
