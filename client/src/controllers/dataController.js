import axios from "axios";
import { setSearchData } from "../redux/dataSlice";
import { setContent } from "../redux/messageSlice";
import { store } from "../redux/store";
import { apiURL } from "../config";

export async function getSingleProductData(searchTerm, quantity = 5) {
  try {
    const response = await axios.get(`${apiURL()}/?searchTerm=${searchTerm}&quantity=${quantity}`);
    // console.log(response.data);
    // stores the data in the store
    store.dispatch(setSearchData(response.data));
  } catch (error) {
    console.log(error.message);
    store.dispatch(setContent({ text: "Error: API is possibly down.", type: "error" }));
  }
}
