export const findFirstProductBySku = (skuId, searchList) => {
  for (const key in searchList) {
    if (searchList.hasOwnProperty(key)) {
      const product = searchList[key].find(
        (item) => item.simplified && item.simplified.sku == skuId
      );
      if (product) {
        // console.log(product);
        return product;
      }
    }
  }
  return null; // Return null if no item found
};
