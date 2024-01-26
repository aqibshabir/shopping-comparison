const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// Use stealth plugin to prevent detection by websites
puppeteer.use(StealthPlugin());

// Define the search term and construct the URL for scraping
const aldiFetchData = async (productName, quantity = 5) => {
  const url = `https://groceries.aldi.co.uk/en-GB/Search?keywords=${productName}`;

  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    headless: "new",
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const cookiesSelector = "#onetrust-accept-btn-handler";
    const cookieBtn = await page.waitForSelector(cookiesSelector);
    await cookieBtn.click();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const productSelector = 'div[data-qa="search-results"]';
    // Check for product's existence
    try {
      await page.waitForSelector(productSelector);
    } catch (e) {
      console.log("No ALDI search results found for the term:", productName);
      await browser.close();
      return [];
    }
    await page.waitForSelector(productSelector);
    const products = await page.$$eval(
      productSelector,
      (elements, quantity) =>
        elements.slice(0, quantity).map((el) => {
          // //extract price function
          const extractPrice = (el) => {
            const priceSpan = el.querySelector(
              ".product-tile-price span.h4 > span"
            );
            if (!priceSpan) return null;
            const priceText = priceSpan.innerText.trim();
            const match = priceText.match(/£(\d+(\.\d{2})?)/);
            return match && match[1]
              ? Math.round(parseFloat(match[1]) * 100)
              : null;
          };

          // //extracting both unit measurement and price per unit measurement
          const extractPricePerUnit = (el) => {
            const pricePerUnitElement = el.querySelector(
              'small[data-qa="product-price"] > span'
            );
            if (!pricePerUnitElement)
              return { unit_price: undefined, unit_measure: undefined };

            const fullText = pricePerUnitElement.innerText.trim();

            // Extracting the numeric value and the unit of measurement
            const priceMatch = fullText.match(/(£\d+\.\d+)(?: per )(\w+)/);
            if (!priceMatch) {
              console.error("Unexpected price per unit format:", fullText);
              return { unit_price: undefined, unit_measure: undefined };
            }

            const priceText = priceMatch[1];
            const unit_measure = priceMatch[2];
            // Convert pounds to pence
            const unit_price = Math.round(
              parseFloat(priceText.replace("£", "")) * 100
            );

            return { unit_price, unit_measure };
          };

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

          const name = el
            .querySelector('[data-qa="search-product-title"]')
            .innerText.trim();
          const price = extractPrice(el);
          const { unit_price, unit_measure } = extractPricePerUnit(el);
          const image = el
            .querySelector(".image-tile img.product-image")
            .src.trim();
          const url = el.querySelector(".image-tile a").href.trim();
          const sku_id = el
            .querySelector(".image-tile a")
            .getAttribute("data-productid")
            .trim();
          const sku_ids = [sku_id];

          const brand = extractBrand(name);

          return {
            supermarket: "aldi",
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

    //     //  //extracting description
    //     const description = await newTab.evaluate(() => {
    //       // all rows in table body
    //       const tableRows = document.querySelectorAll("tbody tr");
    //       // Iterate over each row to find one with 'Legal name'
    //       for (const row of tableRows) {
    //         // Check if the row's header matches 'Legal name'
    //         const header = row.querySelector("th");
    //         if (header && header.innerText.trim() === "Legal name") {
    //           // If it matches, get the description from 'td' cell
    //           const descriptionCell = row.querySelector("td");
    //           return descriptionCell ? descriptionCell.innerText.trim() : "";
    //         }
    //       }

    //       return undefined;
    //     });

    //     //same approach as description but now for brand name
    //     const brand = await newTab.evaluate(() => {
    //       const tableRows = document.querySelectorAll("tbody tr");
    //       for (const row of tableRows) {
    //         const header = row.querySelector("th");
    //         if (header && header.innerText.trim() === "Brand name") {
    //           const brandCell = row.querySelector("td");
    //           return brandCell ? brandCell.innerText.trim() : "";
    //         }
    //       }

    //       return undefined;
    //     });

    //     const category = await newTab.$eval(
    //       ".breadcrumb .breadcrumb-item:nth-child(3) a",
    //       (el) => el.innerText.trim()
    //     );

    //     product.description = description;
    //     product.brand = brand;
    //     product.category_name = category;

    //     delete product.url;
    //   } catch (e) {
    //     console.error(
    //       `ALDI - Error processing product ${product.sku_id}: ${e.message}`
    //     );
    //     product.category_name = null;
    //     product.description = null;
    //     product.brand = null;
    //   } finally {
    //     await newTab.close();
    //   }
    // };

    // await Promise.all(products.map(processProduct));

    // console.log(products);
    return products;
  } catch (e) {
    console.log(
      `ALDI - Error fetching data for ${productName} at ${url}: ${e.message}`
    );
    return [];
  } finally {
    await browser.close();
  }
};

// Testing the data fetch
// aldiFetchData("chicken");

module.exports = { aldiFetchData };
