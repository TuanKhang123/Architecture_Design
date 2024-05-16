import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productsService from "./productsService";

const initialState = {
  products: [],
  productsById: {},
  categoryId: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const getProducts = createAsyncThunk("/", async (_, thunkApi) => {
  try {
    return productsService.getProducts();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkApi.rejectWithValue(message);
  }
});

export const getProductsById = createAsyncThunk("/getProductsById", async ({ accessToken }, thunkApi) => {
  try {
    return productsService.getProductsById({ accessToken });
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkApi.rejectWithValue(message);
  }
});

export const addProducts = createAsyncThunk(
  "/addproducts",
  async ({ product }, thunkApi) => {
    try {
      return productsService.addProducts({ product });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const updateProducts = createAsyncThunk(
  "/updateproducts",
  async ({ product }, thunkApi) => {
    try {
      return productsService.updateProducts({ product });
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const getCategoryById = createAsyncThunk("/getCategoryById", async (_, thunkApi) => {
  try {
    return productsService.getCategoryById();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkApi.rejectWithValue(message);
  }
});

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.data = action.payload;
        state.message = "";
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        state.isSuccess = false;
        state.message = "Dont get data";
      })
      .addCase(getProductsById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsById.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.data = action.payload;
        state.message = "";
      })
      .addCase(getProductsById.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        state.isSuccess = false;
        state.message = "Dont get data";
      })
      .addCase(addProducts.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(addProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(updateProducts.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(updateProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload;
        state.isError = false;
      })
      .addCase(updateProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })

      .addCase(getCategoryById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
        state.data = action.payload;
        state.message = "";
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
        state.isSuccess = false;
        state.message = "Dont get data";
      })
  },
});

export const { reset } = productsSlice.actions;
export default productsSlice
