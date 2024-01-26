const selectProductBySku = () => {
	return `SELECT products.search_term
			FROM products
			JOIN skus ON products.id = skus.product_id
			WHERE skus.sku = ?;`;
};

module.exports = { selectProductBySku };
