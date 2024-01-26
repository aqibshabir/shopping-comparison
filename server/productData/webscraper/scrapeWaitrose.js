const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// Use stealth plugin to prevent detection by websites
puppeteer.use(StealthPlugin());

const waitroseFetchData = async (productName, quantity = 5) => {
  const url = `https://www.waitrose.com/ecom/shop/search?&searchTerm=${productName}`;

  // Main async function for web scraping (IIFE function)
  return (async () => {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
      headless: "new",
    });
    try {
      const page = await browser.newPage();

      // Navigate to the URL
      await page.goto(url, { waitUntil: "networkidle2" });

      // Accept cookies for seamless navigation
      const cookiesSelector = ".acceptAll___CHGcH";
      const cookieBtn = await page.waitForSelector(cookiesSelector);
      await cookieBtn.click();

      // Selector for product listings
      const productSelector = 'article[data-testid="product-pod"]';
      // Check for product's existence
      try {
        await page.waitForSelector(productSelector);
      } catch (e) {
        console.log(
          "No WAITROSE search results found for the term:",
          productName
        );
        await browser.close();
        return [];
      }
      await page.waitForSelector(productSelector);
      // Extract product data
      const products = await page.$$eval(
        productSelector,
        (articles, quantity) => {
          // Function to extract price from product article
          const extractPrice = (article) => {
            const priceSpan = article.querySelector(
              "div.prices___IA5LC span > span"
            );
            if (!priceSpan) return null;

            const priceText = priceSpan.innerText.trim();
            return priceText.endsWith("p")
              ? parseInt(priceText.replace("p", ""), 10)
              : Math.round(parseFloat(priceText.match(/(\d+\.\d+)/)[1]) * 100);
          };

          // Function to extract price per unit and unit measurement
          const extractPricePerUnit = (article) => {
            const pricePerUnitElement = article.querySelector(
              "span.pricePerUnit___a1PxI"
            );
            if (!pricePerUnitElement)
              return { unit_price: undefined, unit_measure: undefined };

            const fullText = pricePerUnitElement.innerText.trim();
            const priceMatch = fullText.match(/(£\d+\.\d+|\d+\.?\d*p)/);
            const unitMatch = fullText.match(/\/(\w+)/);

            const unit_price = priceMatch
              ? priceMatch[1].includes("£")
                ? Math.round(parseFloat(priceMatch[1].replace("£", "")) * 100)
                : parseInt(priceMatch[1].replace("p", ""), 10)
              : null;

            return { unit_price, unit_measure: unitMatch ? unitMatch[1] : "" };
          };

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

          // Filter and map articles to structured data
          return articles
            .filter((article, index, self) => {
              const isNotSponsored =
                !article.querySelector(".hasBadge___bblVM");
              const isAvailable =
                article.getAttribute("data-product-availability") !==
                "temporarily unavailable";
              const isRegularType =
                article.getAttribute("data-product-pod-type") === "regular";
              const sku_id = article.getAttribute("data-product-id");
              const isFirstOccurrence =
                self.findIndex(
                  (art) => art.getAttribute("data-product-id") === sku_id
                ) === index;

              return (
                isNotSponsored &&
                isAvailable &&
                isRegularType &&
                isFirstOccurrence
              );
            })
            .slice(0, quantity) // Limit to first 5 unique products
            .map((article) => {
              const sku_id = article.getAttribute("data-product-id");
              const sku_ids = [sku_id];
              const name =
                article.querySelector("span.name___STajL")?.innerText;
              const image = article.querySelector(
                'div[data-testid="product-pod-image"] img'
              )?.src;

              const price = extractPrice(article);
              const { unit_price, unit_measure } = extractPricePerUnit(article);
              const brand = extractBrand(name);
              const url = article.querySelector(".nameLink___iKLUD").href;

              return {
                supermarket: "waitrose",
                sku_id,
                sku_ids,
                name,
                brand,
                // description: "",
                // category_name: "",
                image,
                price_info: { price, unit_price, unit_measure },
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
      //     await newTab.goto(product.url, { waitUntil: "networkidle2" });
      //     // Extracting category data
      //     const categorySelector = "nav.breadcrumbs___SkhGo .wrapper___uITPg a";
      //     const categories = await newTab.$$eval(categorySelector, (anchors) =>
      //       anchors.map((anchor) => anchor.innerText.trim())
      //     );
      //     // Selecting exact item from breadcrumb for category
      //     const desiredCategoryIndex = 2;
      //     if (categories.length > desiredCategoryIndex) {
      //       product.category_name = categories[desiredCategoryIndex];
      //     }
      //     // Extracting picker_desc
      //     const descriptionSelector = "section#productDescription";
      //     const description = await newTab.$eval(
      //       descriptionSelector,
      //       (section) => section.innerText.trim()
      //     );
      //     product.description = description;

      //     // Deleting the url property from product
      //     delete product.url;
      //   } catch (e) {
      //     console.error(
      //       `WAITROSE - Error processing product ${product.sku_id}: ${e.message}`
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
      // test log
      // console.log(products);
      return products;
    } catch (e) {
      console.log(
        `WAITROSE - Error fetching data for ${productName} at ${url}: ${e.message}`
      );
      return [];
    } finally {
      await browser.close();
    }
  })();
};

// test data fetch
// waitroseFetchData("pepsi");
module.exports = { waitroseFetchData };
