const mySQLQuery = require("../mysql/connection.js");
const {
  getDataFromMySQLQuery,
  saveProductQuery,
  saveSKUQuery,
  savePriceQuery,
  getSupermarketIdQuery,
  getSKUDataQuery,
  getPriceDataQuery,
  getAllSearchTermsQuery,
} = require("../mysql/queries/productQueries");

// Retrieves product data from db based on the search term
const getDataFromMySQL = async (searchTerm) => {
  try {
    const results = await mySQLQuery(getDataFromMySQLQuery(), [
      `%${searchTerm}%`,
    ]);
    return results;
  } catch (err) {
    console.error("Error in getDataFromMySQL:", err);
    throw err;
  }
};

//save products > products table
const saveProduct = async (productData, searchTerm) => {
  const values = [
    productData.name,
    productData.brand,
    productData.image,
    searchTerm,
  ];
  try {
    const result = await mySQLQuery(saveProductQuery(), values);
    return result.insertId;
  } catch (err) {
    console.error("Error in saveProduct:", err);
    throw err;
  }
};

//save skus > skus table
const saveSKU = async (skuData, productId, supermarketId) => {
  const values = [skuData.sku_id, productId, supermarketId];
  try {
    await mySQLQuery(saveSKUQuery(), values);
  } catch (err) {
    console.error("Error in saveSKU:", err);
    throw err;
  }
};

//save price > price table
const savePrice = async (priceData, productId, supermarketId) => {
  // Checking if both unit_price/price are available (not null)
  if (priceData.unit_price != null && priceData.price != null) {
    const values = [
      productId,
      supermarketId,
      priceData.price,
      priceData.unit_price,
      priceData.unit_measure,
    ];
    try {
      await mySQLQuery(savePriceQuery(), values);
    } catch (err) {
      console.error("Error in savePrice:", err);
      throw err;
    }
  } else {
    // Log a warning or handle the case as needed
    console.log(
      `Skipping price save for product ID ${productId} due to missing unit price or price.`
    );
  }
};

//gets id of supermarket
const getSupermarketId = async (supermarketName) => {
  try {
    const results = await mySQLQuery(getSupermarketIdQuery(), [
      supermarketName,
    ]);
    if (results.length === 0) {
      throw new Error(`Supermarket not found: ${supermarketName}`);
    }
    return results[0].id;
  } catch (err) {
    console.error("Error in getSupermarketId:", err);
    throw err;
  }
};

// getting sku for a product
const getSKUData = async (productId) => {
  try {
    const results = await mySQLQuery(getSKUDataQuery(), [productId]);
    return results;
  } catch (err) {
    console.error("Error in getSKUData:", err);
    throw err;
  }
};

// getting price for a product
const getPriceData = async (productId, supermarketId) => {
  try {
    const results = await mySQLQuery(getPriceDataQuery(), [
      productId,
      supermarketId,
    ]);
    return results;
  } catch (err) {
    console.error("Error in getPriceData:", err);
    throw err;
  }
};

//getting all search terms (for cache)
const getAllSearchTerms = async () => {
  try {
    const results = await mySQLQuery(getAllSearchTermsQuery());
    return results.map((row) => row.search_term);
  } catch (err) {
    console.error("Error in getAllSearchTerms:", err);
    throw err;
  }
};

module.exports = {
  getDataFromMySQL,
  saveProduct,
  saveSKU,
  savePrice,
  getSupermarketId,
  getSKUData,
  getPriceData,
  getAllSearchTerms,
};
