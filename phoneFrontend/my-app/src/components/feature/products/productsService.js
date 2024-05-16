import axios from "axios";

const getProducts = async () => {
  const response = await axios.get("http://localhost:8000/product/getproduct");
  return response.data;
};

const getProductsById = async ({ accessToken }) => {
  const response = await
    axios.get
      (`http://localhost:8000/product/getproductdetail/${window.location.href.substring(window.location.href.lastIndexOf("/") + 1)}`, {
        headers: {
          Authorization: "Bearer " + accessToken
        },
      });
  return response.data
};

const addProducts = async ({ product }) => {
  const response = await axios.post(
    "http://localhost:8000/product/addproduct",
    product,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const updateProducts = async ({ product }) => {

  const response = await axios.post(
    "http://localhost:8000/product/updateproduct",
    product,
    {
      headers: {

        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const getCategoryById = async () => {
  const response = await axios.get("http://localhost:8000/product/getcategory/:id");
  return response.data;
};

const productsService = {
  getProducts,
  getProductsById,
  addProducts,
  getCategoryById,
  updateProducts,
};

export default productsService;
