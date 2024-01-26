const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// Use stealth plugin to prevent detection by websites
puppeteer.use(StealthPlugin());

const asdaFetchData = async (productName, quantity = 5) => {
  const url = `https://groceries.asda.com/search/${productName}`;

  return (async () => {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ headless: "new" });
    try {
      const page = await browser.newPage();
      // Navigate to the URL
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 0 });

      // Accept cookies for seamless navigation
      const cookiesSelector = "#onetrust-accept-btn-handler";
      const cookieBtn = await page.waitForSelector(cookiesSelector);
      await cookieBtn.click();

      // Selector for product listings
      const productSelector = ".co-item";
      // Check for product's existence
      try {
        await page.waitForSelector(productSelector, { timeout: 60000 });
      } catch (e) {
        console.log("No ASDA search results found for the term:", productName);
        await browser.close();
        return [];
      }
      await page.waitForSelector(productSelector);

      const products = await page.$$eval(
        productSelector,
        (elements, quantity) =>
          elements
            .filter((el) => {
              // skip out of stock products
              const isOutOfStock = el.querySelector(".unavailable-banner");
              return !isOutOfStock;
            })
            .slice(0, quantity)
            .map((el) => {
              //extract brand function
              const extractBrand = (name) => {
                const words = name.split(" ");
                let brand = words[0];
                if (
                  (brand.length <= 3 || words[1] === "&") &&
                  words.length > 1
                ) {
                  brand += ` ${words[1]}`;
                  if (words[1] === "&" && words.length > 2) {
                    brand += ` ${words[2]}`;
                  }
                }

                return brand;
              };

              //extract price
              const extractPrice = (el) => {
                const priceSpan = el.querySelector(".co-product__price");
                if (!priceSpan) return null;
                const priceText = priceSpan.innerText.trim();
                const match = priceText.match(/now\n£(\d+(\.\d{2})?)/);
                return match && match[1]
                  ? Math.round(parseFloat(match[1]) * 100)
                  : null;
              };

              const extractPricePerUnit = (el) => {
                const pricePerUnitElement = el.querySelector(
                  ".co-product__price-per-uom"
                );
                if (!pricePerUnitElement)
                  return { unit_price: undefined, unit_measure: undefined };
                const fullText = pricePerUnitElement.innerText.trim();
                const priceMatch = fullText.match(
                  /\((£\d+\.\d+|\d+\.?\d+p)\/(\w+)\)/
                );
                if (!priceMatch) {
                  console.error("Unexpected price per unit format:", fullText);
                  return { unit_price: undefined, unit_measure: undefined };
                }
                let unit_price;
                const priceText = priceMatch[1];
                const unit_measure = priceMatch[2];

                if (priceText.includes("£")) {
                  unit_price = Math.round(
                    parseFloat(priceText.replace("£", "")) * 100
                  );
                } else if (priceText.endsWith("p")) {
                  unit_price = Math.round(
                    parseFloat(priceText.replace("p", ""))
                  );
                }

                return { unit_price, unit_measure };
              };

              const name = el
                .querySelector(".co-product__anchor")
                .innerText.trim();
              const price = extractPrice(el);
              const { unit_price, unit_measure } = extractPricePerUnit(el);
              const url = el.querySelector(".co-product__anchor").href;
              const image = el.querySelector(".asda-img").src;
              const brand = extractBrand(name);
              const sku_id = (el
                .querySelector(".co-product__anchor")
                .href.match(/\/(\d+)$/) || [])[1];

              return {
                supermarket: "asda",
                sku_id,
                sku_ids: [sku_id],
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
            }),
        quantity
      );

      // ****COMMENTED OUT DUE TO PERFORMANCE****

      // const processProduct = async (product) => {
      //   const newTab = await browser.newPage();

      //   try {
      //     await newTab.goto(product.url, {
      //       waitUntil: "networkidle2",
      //       timeout: 0,
      //     });
      //     await newTab.waitForSelector(
      //       ".pdp-description-reviews__product-details-cntr",
      //       { visible: true }
      //     );
      //     await newTab.waitForSelector(".pdp-breadcrumb > a:first-child", {
      //       visible: true,
      //     });
      //     await newTab.waitForSelector(
      //       ".pdp-main-details__meta-info .pdp-main-details__product-code",
      //       {
      //         visible: true,
      //       }
      //     );
      //     // Extract description
      //     try {
      //       // Wait for the description container to be available
      //       const description = await newTab.$$eval(
      //         ".pdp-description-reviews__product-details-cntr",
      //         (containers) => {
      //           let descriptionText = "";
      //           let foundProductInfo = false;

      //           // First, try to find 'Product Information'
      //           containers.forEach((container) => {
      //             if (!foundProductInfo) {
      //               const title = container.querySelector(
      //                 ".pdp-description-reviews__product-details-title"
      //               );
      //               if (
      //                 title &&
      //                 /Product Information/i.test(title.innerText.trim())
      //               ) {
      //                 const contentDiv = container.querySelector(
      //                   ".pdp-description-reviews__product-details-content"
      //                 );
      //                 if (contentDiv) {
      //                   descriptionText +=
      //                     contentDiv.innerText.replace(/\n/g, " ").trim() + " ";
      //                   foundProductInfo = true;
      //                 }
      //               }
      //             }
      //           });

      //           // If 'Product Information' not found, try 'ASDA Product Information'
      //           if (!foundProductInfo) {
      //             containers.forEach((container) => {
      //               const title = container.querySelector(
      //                 ".pdp-description-reviews__product-details-title"
      //               );
      //               if (
      //                 title &&
      //                 /ASDA Product Information/i.test(title.innerText.trim())
      //               ) {
      //                 const contentDiv = container.querySelector(
      //                   ".pdp-description-reviews__product-details-content"
      //                 );
      //                 if (contentDiv) {
      //                   descriptionText +=
      //                     contentDiv.innerText.replace(/\n/g, " ").trim() + " ";
      //                 }
      //               }
      //             });
      //           }

      //           return descriptionText.trim();
      //         }
      //       );
      //       product.description = description ? description : null;
      //     } catch (e) {
      //       console.error(`ASDA - Error extracting description: ${e.message}`);
      //       product.description = null;
      //     }

      //     // Extract category name
      //     try {
      //       const category_name = await newTab.$eval(
      //         ".pdp-breadcrumb > a:first-child",
      //         (el) => {
      //           return el.childNodes[1]
      //             ? el.childNodes[1].textContent.trim()
      //             : "";
      //         }
      //       );
      //       product.category_name = category_name;
      //     } catch (e) {
      //       console.error(
      //         `ASDA - Error extracting category name: ${e.message}`
      //       );
      //       product.category_name = null;
      //     }

      //     //extract sku_id
      //     try {
      //       const sku_id = await newTab.$eval(
      //         ".pdp-main-details__meta-info .pdp-main-details__product-code",
      //         (el) => {
      //           const skuText = el.textContent.trim();
      //           const match = skuText.match(/Product code:\s*(\d+)/);
      //           return match ? match[1] : null;
      //         }
      //       );
      //       product.sku_id = sku_id;
      //       product.sku_ids = sku_id ? [sku_id] : null;
      //     } catch (e) {
      //       console.error(`ASDA - Error extracting SKU ID: ${e.message}`);
      //       product.sku_id = null;
      //       product.sku_ids = null;
      //     }
      //     delete product.url;
      //   } catch (e) {
      //     console.error(`ASDA - Error processing product: ${e.message}`);
      //   } finally {
      //     await newTab.close();
      //   }
      // };

      // await Promise.all(products.map(processProduct));
      //test log
      // console.log(products);
      return products;
    } catch (e) {
      console.log(
        `Error fetching ASDA data for ${productName} at ${url}: ${e.message}`
      );
      return [];
    } finally {
      await browser.close();
    }
  })();
};

// asdaFetchData("chicken");

module.exports = { asdaFetchData };
