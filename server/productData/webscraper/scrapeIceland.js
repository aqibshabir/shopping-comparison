const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const icelandFetchData = async (productName, quantity = 5) => {
  const url = `https://www.iceland.co.uk/search?q=${productName}`;

  return (async () => {
    const browser = await puppeteer.launch({
      headless: "new",
    });

    try {
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: "domcontentloaded" });

      const productSelector = ".grid-tile";
      // Check for product's existence
      try {
        await page.waitForSelector(productSelector);
      } catch (e) {
        console.log(
          "No ICELAND search results found for the term:",
          productName
        );
        await browser.close();
        return [];
      }
      await page.waitForSelector(productSelector);

      const products = await page.$$eval(
        productSelector,
        (elements, quantity) => {
          //filtered any results that come back with values missing (online exclusive have a different structure)
          const filteredElements = elements.filter((el) => {
            const isNotOnlineExclusive = !el.querySelector(
              ".product-badge.product-badge-blue.bg-jacksons-purple"
            );
            const hasName = !!el.querySelector(".product-name .name-link span");
            return isNotOnlineExclusive && hasName;
          });

          return filteredElements.slice(0, quantity).map((el) => {
            //extract brand function
            const extractBrand = (name) => {
              const words = name.split(" ");
              let brand = words[0];
              if ((brand.length <= 3 || words[1] === "&") && words.length > 1) {
                brand += ` ${words[1]}`;
                if (words[1] === "&" && words.length > 2) {
                  brand += ` ${words[2]}`;
                }
              }

              return brand;
            };

            //extract price function
            const extractPrice = (el) => {
              const priceSpan = el.querySelector(
                ".tile-actions .product-sales-price span"
              );
              if (!priceSpan) return null;
              const priceText = priceSpan.innerText.trim();
              const match = priceText.match(/£(\d+(\.\d{2})?)/);
              return match && match[1]
                ? Math.round(parseFloat(match[1]) * 100)
                : null;
            };

            //extract unit_price and unit_measure function
            const extractPricePerUnit = (el) => {
              const pricePerUnitElement = el.querySelector(
                ".tile-actions .product-pricing-info"
              );
              if (!pricePerUnitElement)
                return { unit_price: undefined, unit_measure: undefined };
              const fullText = pricePerUnitElement.innerText.trim();
              const priceMatch = fullText.match(
                /(£\d+\.\d+|\d+\.?\d*p) per ([\w\s]+)/
              );
              if (!priceMatch)
                return { unit_price: undefined, unit_measure: undefined };
              const unit_price = priceMatch[1].includes("£")
                ? Math.round(parseFloat(priceMatch[1].replace("£", "")) * 100)
                : parseInt(priceMatch[1].replace("p", ""), 10);
              const unit_measure = priceMatch[2];
              return { unit_price, unit_measure };
            };

            const nameElement = el.querySelector(
              ".product-name .name-link span"
            );
            const name = nameElement ? nameElement.innerText.trim() : "Unknown";
            const price = extractPrice(el);
            const { unit_price, unit_measure } = extractPricePerUnit(el);
            const brand = extractBrand(name);
            const imageElement = el.querySelector(".product-image img");
            const image = imageElement
              ? imageElement.getAttribute("src")
              : undefined;
            const urlElement = el.querySelector(".product-image .thumb-link");
            const url = urlElement ? urlElement.href : "No URL available";
            const skuElement = el.querySelector(".product-tile");
            const sku_id = skuElement
              ? skuElement.getAttribute("data-itemid")
              : "Unknown";
            const sku_ids = [sku_id];

            return {
              supermarket: "iceland",
              sku_id,
              sku_ids,
              name,
              brand,
              // category_name: "",
              // description: "",
              image,
              price_info: {
                price,
                unit_price,
                unit_measure,
              },
              // url,
            };
          });
        },
        quantity
      );

      // ****COMMENTED OUT DUE TO PERFORMANCE****

      // const processProduct = async (product) => {
      //   const newTab = await browser.newPage();
      //   try {
      //     await newTab.goto(product.url, { waitUntil: "domcontentloaded" });

      //     // // Selector for product description and category
      //     const descriptionSelector =
      //       "#collapse-additional-info > div > p:first-of-type";
      //     const categorySelector =
      //       "ol.breadcrumb.bc-inline li.breadcrumb-item:first-child";

      //     // // Extract product description
      //     const description = await newTab.$eval(descriptionSelector, (el) =>
      //       el.innerText.trim()
      //     );
      //     product.description = description;

      //     // Extract category
      //     const category_name = await newTab.$eval(categorySelector, (el) =>
      //       el.innerText.trim()
      //     );
      //     product.category_name = category_name;
      //     delete product.url;
      //   } catch (e) {
      //     console.error(
      //       `ICELAND - Error processing product ${product.sku_id}: ${e.message}`
      //     );
      //     // setting default values
      //     product.category_name = null;
      //     product.description = null;
      //   } finally {
      //     if (newTab) {
      //       await newTab.close();
      //     }
      //   }
      // };
      // await Promise.all(products.map(processProduct));
      //testing log:
      // console.log(products);
      return products;
    } catch (e) {
      console.log(
        `ICELAND - Error fetching data for ${productName} at ${url}: ${e.message}`
      );
      return [];
    } finally {
      await browser.close();
    }
  })();
};

// testing data fetch
// icelandFetchData("chicken");
module.exports = { icelandFetchData };
