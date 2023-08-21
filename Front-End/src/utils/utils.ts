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
