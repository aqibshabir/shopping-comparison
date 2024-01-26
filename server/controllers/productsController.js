const {
  getDataFromMySQL,
  saveProduct,
  saveSKU,
  savePrice,
  getSupermarketId,
  getSKUData,
  getPriceData,
  getAllSearchTerms,
} = require("../models/productModel");
const CacheManager = require("../utils/cacheManger.js");
const axios = require("axios");

const cacheManager = new CacheManager();

const fetchProducts = async (req, res) => {
  const { searchTerm, quantity } = req.query;

  // Check cache for searchTerm
  const cachedData = cacheManager.get(searchTerm);
  if (cachedData) {
    console.log(`Serving ${searchTerm} from cache`);
    res.send({ [searchTerm]: cachedData });
    return;
  }

  try {
    // Check database for searchTerm
    console.log(`...not in cache, checking database for: ${searchTerm}`);
    const mysqlData = await getDataFromMySQL(searchTerm);
    if (mysqlData.length) {
      try {
        console.log(`Found ${searchTerm} in the database`);
        const data = await reconstructData(searchTerm);
        //caching reconstructed data
        cacheManager.set(searchTerm, data);
        res.send({ [searchTerm]: data });
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
      return;
    }

    // If not in cache/db then scrape data
    console.log(`...not in database, now scraping data for: ${searchTerm}`);
    // const scrapedData = await getProducts(searchTerm, Number(quantity));
    //now getting data from dedicated server
    let scrapedData = await axios.get(
      // `http://${process.env.SCRAPER_IP}:6001/scraper?searchTerm=${searchTerm}`
      `http://localhost:6001/scraper?searchTerm=${searchTerm}`
    );

    scrapedData = scrapedData.data;

    if (!Array.isArray(scrapedData[searchTerm])) {
      console.error("Scraped data is not an array or is undefined");
      res.status(500).send("Error processing data");
      return;
    }

    // Processing/saving scraped data
    for (const product of scrapedData[searchTerm]) {
      const productId = await saveProduct(product.simplified, searchTerm);
      for (const [supermarketName, productDetails] of Object.entries(
        product.complete
      )) {
        const supermarketId = await getSupermarketId(supermarketName);
        await saveSKU(productDetails, productId, supermarketId);
        await savePrice(productDetails.price_info, productId, supermarketId);
      }
    }

    // Update cache with new data
    console.log(`Stored scraped data for ${searchTerm} in database and cache`);
    cacheManager.set(searchTerm, scrapedData[searchTerm]);
    res.send({ [searchTerm]: scrapedData[searchTerm] });
  } catch (err) {
    console.error("Error in fetchProducts:", err);
    res.status(500).send("Internal Server Error");
  }
};

// reconstructing data
const reconstructData = async (searchTerm) => {
  try {
    // console.log(`Fetching data for searchTerm: ${searchTerm}`);
    const products = await getDataFromMySQL(searchTerm);

    // Check if products is an array and not empty
    if (!Array.isArray(products) || products.length === 0) {
      throw new Error(`No products found for searchTerm: ${searchTerm}`);
    }

    // initializing reconstructedData empty array for each product
    const reconstructedData = [];

    //iterating over each product from db
    for (const product of products) {
      // finds all sku data for current product
      const skus = await getSKUData(product.id);

      //complete data object
      const completeData = {};
      // collecting all SKU IDs for simplified data
      const skuIds = skus.map((sku) => sku.sku);
      // price info for simplified part
      let priceInfo = {};

      //iterating over skus to find price data
      for (const sku of skus) {
        const priceData = await getPriceData(product.id, sku.supermarket_id);
        // console.log(priceData);
        completeData[sku.supermarket_name] = {
          sku: sku.sku,
          ...priceData,
        };

        // Building price_info for simplified data
        priceInfo[sku.supermarket_name] = priceData[0];
      }

      reconstructedData.push({
        simplified: {
          sku_id: skus[0]?.sku,
          sku_ids: skuIds,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price_info: priceInfo,
        },
        complete: completeData,
      });
    }
    return reconstructedData;
  } catch (err) {
    console.error("Error in reconstructData:", err);
    throw err;
  }
};

// data from database into cache
const loadAllDataIntoCache = async () => {
  try {
    // Fetching all unique search terms from the database
    const searchTerms = await getAllSearchTerms();

    // For each search term - fetch/reconstruct data
    for (const searchTerm of searchTerms) {
      const reconstructedData = await reconstructData(searchTerm);
      cacheManager.set(searchTerm, reconstructedData);
    }
  } catch (err) {
    console.error("Error in loadAllDataIntoCache:", err);
  }
};

module.exports = { fetchProducts, reconstructData, loadAllDataIntoCache };
