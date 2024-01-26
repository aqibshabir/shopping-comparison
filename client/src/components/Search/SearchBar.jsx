import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getSingleProductData } from "../../controllers/dataController";
import { selectProductData } from "../../redux/dataSlice";
import { sortSearchResults } from "../../utils/sortSearchResults";
import BarcodeScanner from "../BarcodeScanner/BarcodeScanner";
import ScannerButton from "../BarcodeScanner/ScannerButton";
import Spinner from "../Spinner";
import "./SearchBarResults.scss";
import SearchResults from "./SearchResults";
import SearchResultsSort from "./SortDisplay";
import { CiSearch } from "react-icons/ci";

function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const productData = useSelector(selectProductData);
  const [search, setSearch] = useState(searchParams.get("query") || "");
  const [searchResults, setSearchResults] = useState();
  const [sortOption, setSortOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //////////// CAMERA HANDLER ////////////////
  const [cameraActive, setCameraActive] = useState(false);
  ///////////////////////////////////////////

  // Function to update search results
  const updateSearchResults = () => {
    setSearchResults(productData[search]);
  };

  // Effect to handle the initial load with search query
  useEffect(() => {
    if (search) {
      updateSearchResults();
    }
  }, [search]);

  // Effect to handle changes in product data
  useEffect(() => {
    if (!search) return;
    // console.log("Change in product data detected");
    updateSearchResults();
    setIsLoading(false);
    // console.log("Data Arrived!");
  }, [productData, search]);

  // Handle search form submission
  const handleSearch = (e) => {
    if (e) e.preventDefault(); // Prevent default form submission behavior
    setSearchParams({ query: search }); // Update URL query parameter
    // console.log("Requested Data!");
    setIsLoading(true);
    getSingleProductData(search); // Fetch data based on search
  };

  const handleScanner = (searchTerm) => {
    setSearch(searchTerm);
    setSearchParams({ query: searchTerm });
    getSingleProductData(searchTerm);
    setIsLoading(true);
  };

  // Sorting search results
  const sortedSearchResults = sortSearchResults(searchResults, sortOption);
  // console.log(searchResults);
  return (
    <div className="container">
      <form onSubmit={handleSearch}>
        <div className="search">
          <input
            className="searchBox"
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button className="searchButton" type="submit">
            <CiSearch />
          </button>

          {/* Scanner button */}
          <ScannerButton
            className="scannerButton"
            cameraActive={cameraActive}
            setCameraActive={setCameraActive}
          />
        </div>
      </form>

      {/* Camera container */}
      <BarcodeScanner
        cameraActive={cameraActive}
        setCameraActive={setCameraActive}
        handleSearch={handleScanner}
        setSearch={setSearch}
      />

      {isLoading && <Spinner />}

      {sortedSearchResults && sortedSearchResults.length > 0 && (
        <div className="buttonContainer">
          <SearchResultsSort setSortOption={setSortOption} />
          <SearchResults searchResults={sortedSearchResults} />
        </div>
      )}
    </div>
  );
}

export default SearchBar;
