const { stringSimilarity } = require("string-similarity-js");
const { aldiFetchData } = require("./webscraper/scrapeAldi.js");
const { asdaFetchData } = require("./webscraper/scrapeAsda.js");
const { icelandFetchData } = require("./webscraper/scrapeIceland.js");
const { morrisonsFetchData } = require("./webscraper/scrapeMorrisons.js");
const { ocadoFetchData } = require("./webscraper/scrapeOcado.js");
const { sainsburysFetchData } = require("./webscraper/scrapeSainsburys.js");
const { tescoFetchData } = require("./webscraper/scrapeTesco.js");
const { waitroseFetchData } = require("./webscraper/scrapeWaitrose.js");

const express = require("express");
const app = express();

/**
 * Function that get the products, normalize and structure the data
 * @function getProducts
 * @param {String} query	string product name to search for
 * @param {Number} count	number of products to return
 * @return {Object}			return an object containing the query as a key and the result of the search as a value
 */

const getProducts = async (query, count = 5) => {
  // Throwing an error if the query not provided
  if (!query) {
    throw new Error("Please provide a valid query.");
  }

  // input params
  const input = {
    query,
    limit: count,
  };

  const supermarkets = [
    tescoFetchData,
    sainsburysFetchData,
    asdaFetchData,
    morrisonsFetchData,
    ocadoFetchData,
    icelandFetchData,
    waitroseFetchData,
    aldiFetchData,
  ];

  const supermarketData = [];

  for (const fetchData of supermarkets) {
    try {
      const data = await fetchData(input.query, input.count);
      if (data) {
        supermarketData.push(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // check if at least one supermarket has data
  if (supermarketData.length === 0) {
    console.log(`No data found for product: ${query}.`);
    return;
  }

  // Preparing result object, keying it by the search query and assigning - limited products value
  const result = {};
  result[query] = structureData(supermarketData);

  // Returning result object
  return result;
};

/**
 * function to find the most similar product between a reference product and an array of products
 * @function findMostSimilarProduct
 * @param {Object} referenceProduct	reference product object
 * @param {Array} compareProducts	array of products of a given supermarket to compare against the reference product
 * @return {Object} 				most similar product to the reference product
 */
const findMostSimilarProduct = (referenceProduct, compareProducts) => {
  let highestSimilarity = 0;
  let mostSimilarProduct = null;
  const referenceItem = referenceProduct.name;

  compareProducts.forEach((product) => {
    const compareItem = product.name;

    // give the products to the check similarity
    // stringSimilarity returns a number between 0 and 1
    const similarity = stringSimilarity(referenceItem, compareItem);

    if (similarity > 0.4 && similarity > highestSimilarity) {
      highestSimilarity = similarity;
      mostSimilarProduct = product;
    }
  });

  return mostSimilarProduct;
};

/**
 * function to structure the data and find the match product between supermarkets
 * @function structureData
 * @param {Array} supermarket	array of supermarkets. supermarkets are arrays containing objects which are the products
 * @return {Array}				array of simplified and complete products that are a match
 */
const structureData = (supermarkets) => {
  const [referenceSupermarket, ...otherSupermarkets] = supermarkets;
  const results = [];

  // loop through each product in the reference supermarket (first supermarket in the parameter list)
  referenceSupermarket.forEach((referenceProduct) => {
    let compareResults = {
      [referenceProduct.supermarket]: referenceProduct,
    };
    // compare reference product with each other supermarket
    otherSupermarkets.forEach((supermarket) => {
      if (supermarket) {
        const mostSimilarProduct = findMostSimilarProduct(
          referenceProduct,
          supermarket
        );
        if (mostSimilarProduct) {
          compareResults[mostSimilarProduct.supermarket] = mostSimilarProduct;
        }
      }
    });

    results.push({
      // simplified is just one object with the prices of all supermarkets.
      simplified: createSimplifiedData(...Object.values(compareResults)),

      // complete is the individual supermarket data for the products that match.
      complete: compareResults,
    });
  });

  return results;
};

/**
 * function to combine the prices of multiple products from different supermarkets
 * @function createSimplifiedData
 * @param {Array} data	array of normalized product objects
 * @return {Object}		simplified product object of all supermarkets
 */
const createSimplifiedData = (...supermarkets) => {
  // data array will always contain at least one product from the reference supermarket
  const referenceSupermarket = supermarkets[0];

  /* Loop through other supermarkets and add their data
	 * This is what the price info object looks like (values are just an example)
	 * price_info: {
	 * 		asda: {
	 * 				price: 170,
	 *				unit_price: 150,
	 *				unit_measure: 10
	 *  			}
	 * }
	 
	 */
  let priceInfo = {};
  supermarkets.forEach((supermarket) => {
    if (supermarket) {
      priceInfo[supermarket.supermarket] = {
        price: supermarket.price_info.price,
        unit_price: supermarket.price_info.unit_price || null,
        unit_measure: supermarket.price_info.unit_measure || null,
      };
    }
  });

  // Flattening the sku_ids to form single array
  const skuIds = supermarkets.flatMap(
    (supermarket) => supermarket.sku_ids || []
  );

  // Return the simplified version with the pricing information
  return {
    sku_id: referenceSupermarket.sku_id,
    sku_ids: skuIds,
    // asda item name when searched
    name: referenceSupermarket.name,
    brand: referenceSupermarket.brand,
    // description: referenceSupermarket.description,
    // category_name: referenceSupermarket.category_name,
    image: referenceSupermarket.image,
    price_info: priceInfo,
  };
};

// test getting a full product
// const products = await getProducts("pepsi", 5);
// console.log(products);

// (async () => {
//   try {
//     const products = await getProducts("chicken");
//     console.log(products.chicken[4].simplified);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();

// module.exports = { getProducts };

app.get("/scraper", async (req, res) => {
  const data = await getProducts(req.query.searchTerm);
  res.send(data);
});

app.listen(6001, () => {
  console.log("Scraper server running, on port 6001!");
});
