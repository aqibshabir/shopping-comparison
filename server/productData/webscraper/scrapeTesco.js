const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// Use stealth plugin to prevent detection by websites
puppeteer.use(StealthPlugin());

const tescoFetchData = async (productName, quantity = 5) => {
  const url = `https://www.tesco.com/groceries/en-GB/search?query=${productName}`;

  return (async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    try {
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: "domcontentloaded" });

      // Accept cookies for seamless navigation
      const cookiesSelector =
        ".shared-containers__StyledInnerContainer-sc-93ev6e-2";
      const cookieBtn = await page.waitForSelector(cookiesSelector);
      await cookieBtn.click();

      const productSelector = ".product-list--list-item";
      // Check for product's existence
      try {
        await page.waitForSelector(productSelector);
      } catch (e) {
        console.log("No TESCO search results found for the term:", productName);
        await browser.close();
        return [];
      }
      await page.waitForSelector(productSelector);

      const products = await page.$$eval(
        productSelector,
        (elements, quantity) =>
          elements
            .filter((el) => {
              // if sponsored skip it
              const isSponsored = el.querySelector(
                ".styled__StyledSpecialOfferSash-sc-2u3ojq-0.pa-Dwh"
              );
              return !isSponsored;
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

              //extract price function
              const extractPrice = (el) => {
                const priceSpan = el.querySelector(
                  ".styled__StyledHeading-sc-119w3hf-2"
                );
                if (!priceSpan) return null;
                const priceText = priceSpan.innerText.trim();
                const match = priceText.match(/£(\d+(\.\d{2})?)/);
                return match && match[1]
                  ? Math.round(parseFloat(match[1]) * 100)
                  : null;
              };

              //extracting unit_price/unit_measure
              const extractPricePerUnit = (el) => {
                const pricePerUnitElement = el.querySelector(
                  ".styled__StyledFootnote-sc-119w3hf-7"
                );
                if (!pricePerUnitElement)
                  return { unit_price: undefined, unit_measure: undefined };
                const fullText = pricePerUnitElement.innerText.trim();
                const priceMatch = fullText.match(/£(\d+\.\d+)\/(\w+)/);
                if (!priceMatch) {
                  console.error("Unexpected price per unit format:", fullText);
                  return { unit_price: undefined, unit_measure: undefined };
                }
                const unit_price = parseFloat(priceMatch[1]) * 100;
                const unit_measure = priceMatch[2];

                return { unit_price, unit_measure };
              };

              const name = el
                .querySelector(".styled__Text-sc-1i711qa-1")
                .innerText.trim();
              const price = extractPrice(el);
              const { unit_price, unit_measure } = extractPricePerUnit(el);
              const image = el
                .querySelector(".product-image__container img")
                .getAttribute("srcset")
                .split(", ")[0]
                .split(" ")[0];
              const url =
                "https://www.tesco.com" +
                el
                  .querySelector("h3.styles__H3-oa5soe-0.gbIAbl a")
                  .getAttribute("href");
              const sku_id = el
                .querySelector(".styles__StyledTiledContent-dvv1wj-3")
                .getAttribute("data-auto-id");
              const sku_ids = [sku_id];

              const brand = extractBrand(name);

              return {
                supermarket: "tesco",
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
            }),
        quantity
      );

      // ****COMMENTED OUT DUE TO PERFORMANCE****

      // const processProduct = async (product) => {
      //   const newTab = await browser.newPage();
      //   try {
      //     await newTab.goto(product.url, { waitUntil: "domcontentloaded" });
      //     // Selector for product description and category_name
      //     const descriptionSelector = ".styled__PanelContent-sc-110ics9-5 span";
      //     const description = await newTab.$eval(descriptionSelector, (el) =>
      //       el.innerText.trim()
      //     );
      //     product.description = description;

      //     // Extracting category data
      //     const categorySelector =
      //       "ol.styled__OrderedList-sc-li57wm-1.gUMffx.ddsweb-breadcrumb__list";
      //     const category_name = await newTab.$eval(categorySelector, (el) => {
      //       const category = el.childNodes[1];
      //       return category ? category.innerText.trim() : "";
      //     });
      //     product.category_name = category_name;
      //     delete product.url;
      //   } catch (e) {
      //     console.error(
      //       `TESCO - Error processing product ${product.sku_id}: ${e.message}`
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
        `TESCO - Error fetching data for ${productName} at ${url}: ${e.message}`
      );
      return [];
    } finally {
      await browser.close();
    }
  })();
};

// tescoFetchData("pepsi");
module.exports = { tescoFetchData };
