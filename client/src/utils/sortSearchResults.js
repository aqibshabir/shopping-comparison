import { options } from "joi";

export const findLowest = (priceInfo) => {
  const array = Object.entries(priceInfo);
  array.sort((a, b) => {
    // console.log(a, b);

    if (a[1].unit_price > b[1].unit_price) {
      return 1;
    }
    if (a[1].unit_price < b[1].unit_price) {
      return -1;
    }
  });

  return array[0][1].unit_price;
};

// Function to sort results
export const sortSearchResults = (results, option) => {
  if (!results || !option) return results;

  const copy = [...results];

  switch (option) {
    case "priceLowHigh":
      copy.sort((a, b) => {
        return findLowest(a.simplified.price_info) - findLowest(b.simplified.price_info);
      });

      return copy;
    case "priceHighLow":
      copy.sort((a, b) => {
        return findLowest(b.simplified.price_info) - findLowest(a.simplified.price_info);
      });

      return copy;
    // case "pricePerUnitLowHigh":
    //   return results.sort((a, b) => {
    //     const pricePerUnitA = parseFloat(
    //       a.simplified.price_info.price_per_uom.match(/(\d+\.?\d*)/)[0]
    //     );
    //     const pricePerUnitB = parseFloat(
    //       b.simplified.price_info.price_per_uom.match(/(\d+\.?\d*)/)[0]
    //     );
    //     return pricePerUnitA - pricePerUnitB;
    //   });
    // case "pricePerUnitHighLow":
    //   return results.sort((a, b) => {
    //     const pricePerUnitA = parseFloat(
    //       a.simplified.price_info.price_per_uom.match(/(\d+\.?\d*)/)[0]
    //     );
    //     const pricePerUnitB = parseFloat(
    //       b.simplified.price_info.price_per_uom.match(/(\d+\.?\d*)/)[0]
    //     );
    //     return pricePerUnitB - pricePerUnitA;
    //   });
    default:
      return copy;
  }
};
