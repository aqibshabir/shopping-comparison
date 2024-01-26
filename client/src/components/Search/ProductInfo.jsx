import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectProductData } from "../../redux/dataSlice";
import { formatPriceInPounds } from "../../utils/currencyUtils";
import AddNewItemButton from "../ShoppingList/List/Edit/AddNewItemButton";
import { capitaliseFirstLetter } from "../../utils/capitaliseFirstLetter";
import "./ProductInfo.scss";

function ProductInfoPage() {
  const { sku } = useParams();
  const productData = useSelector(selectProductData);
  let productDetails = null;

  Object.keys(productData).some((category) => {
    const product = productData[category].find(
      (p) => p.simplified.sku_id === sku
    );
    if (product) {
      productDetails = product.simplified;
      return true;
    }
    return false;
  });

  if (!productDetails) {
    return <div>Product not found</div>;
  }

  const { name, description, brand, price_info, category_name, image, sku_id } =
    productDetails;

  const newPrices = [];
  for (const key in price_info) {
    if (price_info[key].price) {
      const formattedPrice = formatPriceInPounds(price_info[key].price);
      newPrices.push({ name: key, price: formattedPrice });
    }
  }

  return (
    <div className="productInfo">
      <div className="left-section">
        <p className="productNameMobile">{name}</p>
        <img className="productImage" src={image} alt={`Image of ${name}`} />
        <AddNewItemButton sku_id={sku_id} className="button" />
      </div>
      <div className="right-section">
        <p className="productName">{name}</p>
        <div className="productText">
          <div className="pricing">
            {newPrices.map((price, index) => (
              <p
                key={price.name + index}
                className={`${capitaliseFirstLetter(price.name)}`}
              >
                {capitaliseFirstLetter(price.name)}{" "}
                <span className="price-value">£{price.price}</span>
              </p>
            ))}
          </div>
        </div>

        <p className="category">Category: {category_name}</p>
        <p className="brand">Brand: {brand}</p>
        <p className="productDescription">Description: {description}</p>
      </div>
      {/* Other product details can be added here */}
    </div>
  );
}

export default ProductInfoPage;
