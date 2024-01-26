# FT4 Shop App

- Must have

  - Ability to display product information.
    - Ability to search data/filter it
      - Search by product or description.
      - See recently accessed products
      - Spell checking/correction
      - Ability to filter by location (depending on store) - Geo location API
  - Data must be from multiple sources.

    - This requires the ability to take data from multiple APIs
    - Normalize it
    - Get the data in a standardised format.

  - Ability for people to create shopping lists from that data.
    - People need to be able to create/edit/delete/update multiple shopping lists (CRUD)
    - Analytics - Visualize the total costs, travelling time and other information and supermarket recommendations.
  - Ability to display other information based off the back of the shopping list.

    - Displaying potential recipes from ingredients.

  - Display maps to show the location of the prices and visualize the prices over multiple supermarkets.
    - Take search results or shopping lists and visualize it on a map.
    - Shopping list on one tab, floaty supermarket pricing on a map and calculation of all shopping list.
  - Ability for people to be able to scan an item and view products based off of the bar code.
    - Bar code scanning / Camera input
    - Feed data back into the product search item.
  - Data display - Pricing system to be aware of what user’s discount codes are available based on clubcard membership
    - What discounts users are entitled to.
    - Adapt pricing based on that particular data. Assuming API gives that data.
  - Login system to store data for users. (backend required)
    - Create account login
    - View your account
    - View your information
  - Store card discounts
  - Adding of Shopping items

- Should have

  - Any leftover ingredients, can be used to build a recipe (there is an API for this).
  - Meal plans based on lower priced items, based on family size or dietary preferences.
  - Some algorithm recommending stuff based on users previous activity. Mapping what facilities are available.
  - Shopping lists breakdowns per supermarket
  - When you’re in the shop, scan the barcode with your phone and find cheapest supermarket and find the cheapest price, or scan to input the cheapest price.

- Could have

  - P2P shopping lists to allow users to share lists to other people.
  - Business location API
  - Ability to evaluate for a bolt purchase or better off bulk buying/ gap between discounts.
  - Crowdsourcing data, if there is a price fluctuation, user input for a sale.
  - Petrol Savings between petrol stations/big outlets on a map.

- Responsibilities (Make your own slice! 🍰)
  - Aqib: Data Collection, web scrapping using apify or Asda Data Scraper.
  - Amy: Data going to be used by the maps, devising a data structure that is appropriate, build some sample data.
  - Gustavo: Barcode scanner (tell it to come on, asks for a barcode, spits out a barcode store the barcode in the store, show errors if no camera, choose between cameras the barcode display the UPC). Z-xing and scandit[https://www.scandit.com/]
  - Adnan: Recipes API [https://spoonacular.com/food-api] make up the data and change it later on.
  - James: Multiple shopping lists - Devise a structure on what the data is going to be, quanitity and ability to create multiple to-do lists (redux as the centre for the store).
  - Jeff: Showing all the product data, filtering, sorting and spellchecking the data. Make up some fake data to display for now. Click button to tell the store to render to other screen, details page, link tag for new page.
  - Jonathan: Create account, view account, store card discounts, view your information, fundamental structure of the components, routing.
