import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from './cartService';
const dataOrder = localStorage.getItem('dataOrder');
const initialState = {
  cart: [],
  dataOrder: dataOrder ? dataOrder : null,
  quantityCart: 0,
  totalPriceCart: 0,
  success: false,
  error: false,
  message: '',
};

export const addCart = createAsyncThunk(
  '/addcart',
  async ({ idproducts, idsize, idcolor, idimage, maxquantity, accessToken }, thunkAPI) => {
    try {
      return cartService.addCart(idproducts, idsize, idcolor, idimage, maxquantity, accessToken);
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getCart = createAsyncThunk('/getcart', async ({ accessToken }, thunkAPI) => {
  try {
    return cartService.getCart(accessToken);
  } catch (error) {
    const message =
      (error.respone && error.respone.data && error.respone.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteCart = createAsyncThunk(
  '/deletecart',
  async ({ idsize, idcolor, accessToken }, thunkAPI) => {
    try {
      return cartService.deleteCart(idsize, idcolor, accessToken);
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  '/increasequantity',
  async ({ idsize, idcolor, accessToken }, thunkAPI) => {
    try {
      return cartService.increaseQuantity(idsize, idcolor, accessToken);
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  '/decreasequantity',
  async ({ idsize, idcolor, accessToken }, thunkAPI) => {
    try {
      return cartService.decreaseQuantity(idsize, idcolor, accessToken);
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteAllCart = createAsyncThunk(
  '/deleteallcart',
  async ({ accessToken }, thunkAPI) => {
    try {
      return cartService.deleteAllCart(accessToken);
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: (state) => {
      state.success = false;
      state.error = false;
      state.message = '';
    },
    increaseItemQuantity: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.size[0].color[0].idcolor === action.payload) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        } else {
          return item;
        }
      });
      state.totalPriceCart = state.cart.reduce(
        (prev, curr) =>
          prev +
          curr.quantity * (curr.size[0].pricesize - (curr.size[0].pricesize * curr.discount) / 100),
        0
      );
      state.quantityCart = state.cart.reduce((prev, curr) => prev + curr.quantity, 0);
    },
    decreaseItemQuantity: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item.size[0].color[0].idcolor === action.payload) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        } else {
          return item;
        }
      });
      state.totalPriceCart = state.cart.reduce(
        (prev, curr) =>
          prev +
          curr.quantity * (curr.size[0].pricesize - (curr.size[0].pricesize * curr.discount) / 100),
        0
      );
      state.quantityCart = state.cart.reduce((prev, curr) => prev + curr.quantity, 0);
    },
    totalCart: (state, action) => {
      state.quantityCart = action.payload;
    },
    productInCart: (state, action) => {
      state.cart = action.payload;
    },
    setDataOrder: (state, action) => {
      state.dataOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //add cart
      .addCase(addCart.pending, (state) => {
        state.success = false;
        state.error = false;
        state.message = '';
      })
      .addCase(addCart.fulfilled, (state, action) => {
        // const findResult = state?.cart?.find(
        //   (item) => item.idproducts === action.payload.result.idproducts
        // );
        // if (findResult) {
        //   findResult.quantity = action.payload?.result?.quantity;
        // } else {
        //   state.cart.push(action?.payload?.result);
        // }
        state.success = true;
      })
      .addCase(addCart.rejected, (state, action) => {
        state.error = true;
      })
      //get cart
      .addCase(getCart.pending, (state) => {
        state.success = false;
        state.error = false;
        state.message = '';
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.success = true;
        state.cart = action?.payload;
        state.quantityCart = state.cart.reduce((prev, curr) => prev + curr.quantity, 0);
        state.totalPriceCart = state.cart.reduce(
          (prev, curr) =>
            prev +
            curr.quantity *
              (curr.size[0].pricesize - (curr.size[0].pricesize * curr.discount) / 100),
          0
        );
      })
      .addCase(getCart.rejected, (state) => {
        state.error = true;
      })
      //delete cart
      .addCase(deleteCart.pending, (state) => {
        state.success = false;
        state.error = false;
        state.message = '';
      })
      .addCase(deleteCart.fulfilled, (state, action) => {
        // state.cart = state.cart.filter(
        //   (value) =>
        //     value.size[0].color[0].idcolor !==
        //     action.payload.size[0].color[0].idcolor
        // );
        state.success = true;
      })
      .addCase(deleteCart.rejected, (state) => {
        state.error = true;
      })
      //increase quantity
      .addCase(increaseQuantity.pending, (state) => {
        state.success = false;
        state.error = false;
        state.message = '';
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.success = true;
      })
      .addCase(increaseQuantity, (state, action) => {
        state.error = true;
      })
      //decrease quantity
      .addCase(decreaseQuantity.pending, (state) => {
        state.success = false;
        state.error = false;
        state.message = '';
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.success = true;
      })
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.error = true;
      })
      //delete all cart
      .addCase(deleteAllCart.pending, (state) => {
        state.success = false;
        state.error = false;
        state.message = '';
      })
      .addCase(deleteAllCart.fulfilled, (state, action) => {
        state.success = true;
      })
      .addCase(deleteAllCart.rejected, (state, action) => {
        state.error = true;
      });
  },
});

export const {
  reset,
  increaseItemQuantity,
  decreaseItemQuantity,
  setDataOrder,
  totalCart,
  productInCart,
} = cartSlice.actions;
export default cartSlice;
