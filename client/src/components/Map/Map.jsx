import React from "react";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import jsonData from "./retailpoints.json";
import { CiSearch } from "react-icons/ci";

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      position: null,
      searchText: "",
      distance: 4,
      filteredShops: [],
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState(
          {
            position: [position.coords.latitude, position.coords.longitude],
          },
          () => {
            this.filterShopsByDistance();
          }
        );
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  }

  calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  handleDistanceChange = (event) => {
    this.filterShopsByDistance(event.target.value);
  };

  filterShopsByDistance(userDistance) {
    const { position } = this.state;
    const filteredShops = jsonData.filter((shop) => {
      const distance = this.calculateDistance(
        position[0],
        position[1],
        shop.Latitude,
        shop.Longitude
      );
      return distance <= userDistance;
    });
    // console.log (Date.now()-start);
    this.setState({ filteredShops });
  }

  handleSearch = () => {
    const { searchText, distance } = this.state;
    let filteredShops = jsonData;

    if (searchText) {
      filteredShops = filteredShops.filter((shop) =>
        shop.Name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (distance) {
      this.filterShopsByDistance();
    }

    this.setState({
      filteredShops,
    });
  };

  resetAll = () => {
    this.setState(
      {
        searchText: "",
        distance: 4,
      },
      () => {
        this.filterShopsByDistance();
      }
    );
  };

  header = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
            }}
          >
            <input
              className="searchInput"
              type="text"
              label="Search"
              style={{
                width: "220px",
                height: "35px",
                fontSize: "large",
                marginBottom: "20px",
                marginRight: "10px",
              }}
              onChange={(event) => {
                this.setState({ searchText: event.target.value });
              }}
            ></input>
            <button
              className="searchButton"
              onClick={this.handleSearch}
              style={{
                width: 35,
                height: 35,
                backgroundColor: "rgb(30, 23, 126)",
                borderRadius: "10px",
                marginRight: "5px",
              }}
            >
              <CiSearch className="search-icon" />
            </button>
            <button
              className="favouriteButton"
              onClick={this.resetAll}
              style={{
                width: 35,
                height: 35,
                backgroundColor: "rgb(241, 241, 241)",
                borderRadius: "10px",
                marginRight: "5px",
              }}
            >
              <RestartAltIcon
                className="search-icon"
                style={{ color: "black", fontSize: "25px" }}
              />
            </button>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyItems: "flex-start",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Slider
            style={{
              width: "300px",
              color: "rgb(30, 23, 126)",
              marginLeft: "20px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
            valueLabelDisplay="auto"
            step={0.1}
            min={0.1}
            max={50}
            onChange={this.handleDistanceChange}
          />
        </div>
      </div>
    );
  };

  render() {
    const { position, filteredShops } = this.state;

    return (
      <div>
        {this.header()}
        {position && (
          <div>
            <MapContainer
              center={position}
              zoom={13}
              style={{ width: "100vw", height: "70vh", marginTop: "10px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredShops.map((shop) => (
                <Marker
                  key={shop.id}
                  position={[shop.Latitude, shop.Longitude]}
                >
                  <Popup>
                    <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                      {shop.Name}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {shop.Street}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {shop.Town}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {shop.Postcode}
                    </div>
                  </Popup>
                </Marker>
              ))}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <LocationSearchingIcon
                  color="rgb(30, 23, 126)"
                  fontSize="large"
                />
              </div>
            </MapContainer>
          </div>
        )}
      </div>
    );
  }
}

export default Map;
