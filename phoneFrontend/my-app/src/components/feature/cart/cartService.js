import axios from "axios";

const addCart = async (idproducts, idsize, idcolor, idimage, maxquantity, accessToken) => {
  const response = await axios.post(
    "http://localhost:8000/cart/addcart",
    {
      idproducts,
      idsize,
      idcolor,
      idimage,
      maxquantity,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  return response.data;
};

const getCart = async (accessToken) => {
  const response = await axios.get("http://localhost:8000/cart/getcart", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

const deleteCart = async (idsize, idcolor, accessToken) => {
  const respone = await axios.delete(
    `http://localhost:8000/cart/deletecart/${idsize}/${idcolor}`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  return respone.data;
};

const increaseQuantity = async (idsize, idcolor, accessToken) => {
  const respone = await axios.post(
    "http://localhost:8000/cart/increasequantity",
    {
      idsize,
      idcolor,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  return respone.data;
};

const decreaseQuantity = async (idsize, idcolor, accessToken) => {
  const respone = await axios.post(
    "http://localhost:8000/cart/decreasequantity",
    {
      idsize,
      idcolor,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  return respone.data;
};

const deleteAllCart = async (accessToken) => {
  const respone = await axios.delete(
    "http://localhost:8000/cart/deleteallcart",
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  return respone.data;
};

const cartService = {
  addCart,
  getCart,
  deleteCart,
  increaseQuantity,
  decreaseQuantity,
  deleteAllCart,
};

export default cartService;
