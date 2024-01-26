const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// Use stealth plugin to prevent detection by websites
puppeteer.use(StealthPlugin());

const sainsburysFetchData = async (productName, quantity = 5) => {
  const url = `https://www.sainsburys.co.uk/gol-ui/SearchResults/${productName}`;

  return (async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    try {
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: "networkidle2" });

      // Accept cookies for seamless navigation
      const cookiesSelector = "#onetrust-accept-btn-handler";
      const cookieBtn = await page.waitForSelector(cookiesSelector);
      await cookieBtn.click();

      // Selector for product listings
      const productSelector = "li.pt-grid-item .ln-c-card.pt.pt-card";
      // Check for product's existence
      try {
        await page.waitForSelector(productSelector);
      } catch (e) {
        console.log(
          "No SAINSBURYS search results found for the term:",
          productName
        );
        await browser.close();
        return [];
      }
      await page.waitForSelector(productSelector);

      const products = await page.$$eval(
        productSelector,
        (elements, quantity) =>
          elements
            .filter((el) => {
              //skip if sponsored/featured
              const productHeader = el.querySelector(".product-header--citrus");
              if (productHeader) {
                const headerText = productHeader.textContent.trim();
                return headerText !== "Sponsored" && headerText !== "Featured";
              }
              return true;
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

              //extracting price in pence
              const extractPrice = (el) => {
                const priceSpan = el.querySelector(
                  ".pt__cost__retail-price__wrapper span:first-child"
                );
                if (!priceSpan) return null;

                const priceText = priceSpan.innerText.trim();
                if (priceText.endsWith("p")) {
                  return parseInt(priceText.replace("p", ""), 10);
                } else {
                  // Regex to match price in the format £x or £x.xx
                  const match = priceText.match(/£?(\d+(\.\d+)?)/);
                  if (match && match[1]) {
                    return Math.round(parseFloat(match[1]) * 100);
                  } else {
                    // Handling unexpected price formats
                    console.error("Unexpected price format:", priceText);
                    return null;
                  }
                }
              };
              //extracting unit_price/unit_measure
              const extractPricePerUnit = (el) => {
                const pricePerUnitElement = el.querySelector(
                  ".pt__cost__retail-price__wrapper span:nth-child(2)"
                );
                if (!pricePerUnitElement)
                  return { unit_price: undefined, unit_measure: undefined };
                const fullText = pricePerUnitElement.innerText.trim();
                const priceMatch = fullText.match(
                  /(£\d+\.\d+|\d+p)\s*\/\s*(\w+)/
                );

                if (!priceMatch) {
                  console.error("Unexpected price per unit format:", fullText);
                  return { unit_price: undefined, unit_measure: undefined };
                }
                let unit_price;
                if (priceMatch[1].endsWith("p")) {
                  // Price in pence
                  unit_price = parseInt(priceMatch[1].slice(0, -1), 10);
                } else {
                  // Price in pounds, convert to pence
                  unit_price = parseFloat(priceMatch[1].substring(1)) * 100;
                }

                const unit_measure = priceMatch[2];
                return { unit_price, unit_measure };
              };

              const name = el
                .querySelector(".pt__info__description")
                .innerText.trim();
              const price = extractPrice(el);
              const { unit_price, unit_measure } = extractPricePerUnit(el);
              const brand = extractBrand(name);
              const image = el.querySelector(
                ".pt-image__ribbon-wrapper img"
              ).src;
              const sku_id = el.getAttribute("data-test-id").split("-").pop();
              const sku_ids = [sku_id];
              const url = el.querySelector(".pt__info__description a").href;

              return {
                supermarket: "sainsburys",
                sku_id,
                sku_ids,
                name,
                brand,
                // description: "",
                // category_name: "",
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
      //     await newTab.goto(product.url, { waitUntil: "domcontentloaded" });
      //     // Selector for product description and category_name
      //     //extracting description (two formats found so far)
      //     const descriptionSelector =
      //       ".productText > p:not(:empty), .productText .memo > p:not(:empty)";
      //     await newTab.waitForSelector(descriptionSelector);
      //     const description = await newTab.$eval(descriptionSelector, (el) =>
      //       el.textContent.trim()
      //     );
      //     product.description = description;

      //     // Extracting category data
      //     const categorySelector = ".ln-c-breadcrumbs";
      //     const category_name = await newTab.$eval(categorySelector, (el) => {
      //       const category = el.childNodes[0];
      //       return category ? category.textContent.trim() : "";
      //     });
      //     product.category_name = category_name;
      //     delete product.url;
      //   } catch (e) {
      //     console.error(
      //       `SAINSBURYS - Error processing product ${product.sku_id}: ${e.message}`
      //     );
      //     // setting default values
      //     product.description = null;
      //   } finally {
      //     if (newTab) {
      //       await newTab.close();
      //     }
      //   }
      // };
      // await Promise.all(products.map(processProduct));
      //test log
      // console.log(products);
      return products;
    } catch (e) {
      console.log(
        `SAINSBURYS - Error fetching data for ${productName} at ${url}: ${e.message}`
      );
      return [];
    } finally {
      await browser.close();
    }
  })();
};

// sainsburysFetchData("pepsi");

module.exports = { sainsburysFetchData };
