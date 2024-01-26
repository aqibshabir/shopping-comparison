const mySQLQuery = require("../mysql/connection.js");
const { selectProductBySku } = require("../mysql/queries/scannerQueries");

const getProductNameBySku = async (req, res) => {
	const skuToFind = req.params.sku;

	try {
		const response = await mySQLQuery(selectProductBySku(skuToFind), [
			skuToFind,
		]);
		// console.log(response);

		if (response.length > 0) {
			res.json({ searchTerm: response[0].search_term });
		} else {
			res.status(404).send("Product not found");
		}
	} catch (error) {
		// console.error("Error:", error.message);
		res.status(500).send("Server error");
	}
};

module.exports = { getProductNameBySku };
