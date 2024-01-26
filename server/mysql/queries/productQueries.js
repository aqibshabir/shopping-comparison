const getDataFromMySQLQuery = () => {
  return `SELECT * FROM products WHERE name LIKE ?`;
};

const saveProductQuery = () => {
  return `INSERT INTO products (name, brand, image, search_term) 
  VALUES (?, ?, ?, ?)`;
};

const saveSKUQuery = () => {
  return `INSERT INTO skus (sku, product_id, supermarket_id) VALUES (?, ?, ?)`;
};

const savePriceQuery = () => {
  return `INSERT INTO price (product_id, supermarket_id, price, unit_price, unit_measure) VALUES (?, ?, ?, ?, ?)`;
};

const getSupermarketIdQuery = () => {
  return `SELECT id FROM supermarkets WHERE supermarket_name = ?`;
};

const getSKUDataQuery = () => {
  return `SELECT skus.sku, skus.supermarket_id, supermarkets.supermarket_name 
          FROM skus 
          JOIN supermarkets ON skus.supermarket_id = supermarkets.id 
          WHERE skus.product_id = ?`;
};

const getPriceDataQuery = () => {
  return `SELECT price, unit_price, unit_measure 
          FROM price 
          WHERE product_id = ? AND supermarket_id = ?`;
};

const getAllSearchTermsQuery = () => {
  return `SELECT DISTINCT search_term FROM products`;
};

module.exports = {
  getDataFromMySQLQuery,
  saveProductQuery,
  saveSKUQuery,
  savePriceQuery,
  getSupermarketIdQuery,
  getSKUDataQuery,
  getPriceDataQuery,
  getAllSearchTermsQuery,
};
