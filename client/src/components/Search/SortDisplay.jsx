import React from "react";

const SearchResultsSort = ({ setSortOption }) => {
  return (
    <select className="sortBox" onChange={(e) => setSortOption(e.target.value)}>
      <option value="">Sort by:</option>
      <option value="priceLowHigh">Price - Lowest to Highest</option>
      <option value="priceHighLow">Price - Highest to Lowest</option>
    </select>
  );
};

export default SearchResultsSort;
