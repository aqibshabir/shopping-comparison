/* Converts an amount from pence to pounds and formats it as a string.*/

export function formatPriceInPounds(amountInPence) {
  if (amountInPence != null) return (amountInPence / 100).toFixed(2);
}
