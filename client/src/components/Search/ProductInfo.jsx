import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectProductData } from "../../redux/dataSlice";
import { formatPriceInPounds } from "../../utils/currencyUtils";
import AddNewItemButton from "../ShoppingList/List/Edit/AddNewItemButton";
import { capitaliseFirstLetter } from "../../utils/capitaliseFirstLetter";
import "./ProductInfo.scss";
import { IoIosArrowBack } from "react-icons/io";

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
    <>
      <a className="back-anchor" href="/search">
        <IoIosArrowBack className="back-icon" /> Back to search
      </a>
      <div className="productInfo">
        <div className="left-section">
          <img className="productImage" src={image} alt={`Image of ${name}`} />
          <p className="productNameMobile">{name}</p>
          <p className="brandMobile">{brand}</p>
        </div>
        <div className="right-section">
          <p className="productName">{name}</p>
          <p className="brand">{brand}</p>
          <div className="productText">
            <div className="pricing">
              {newPrices.map((price, index) => (
                <p
                  key={price.name + index}
                  className={`${capitaliseFirstLetter(
                    price.name
                  )} supermarkets`}
                >
                  {capitaliseFirstLetter(price.name)}{" "}
                  <span className="price-value">£{price.price}</span>
                </p>
              ))}
            </div>
          </div>

          <AddNewItemButton sku_id={sku_id} className="add-button" />
          <p className="disclaimer">
            * cheapest product automatically selected
          </p>
        </div>
      </div>
    </>
  );
}

export default ProductInfoPage;
