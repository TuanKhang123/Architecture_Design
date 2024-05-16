import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import favoriteService from "./favoriteService";

const initialState = {
    favorites: [],
    isSuccess: false,
    isError: false
}

export const addFavorite = createAsyncThunk("/addfavorite", ({ accessToken, idproducts, idimage }, thunkApi) => {
    try {
        return favoriteService.addFavorite({ accessToken, idproducts, idimage })
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkApi.rejectWithValue(message);
    }
})

export const deleteFavorite = createAsyncThunk("/deletefavorite", ({ accessToken, idproducts }, thunkApi) => {
    try {
        return favoriteService.deleteFavorite({ accessToken, idproducts })
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkApi.rejectWithValue(message);
    }
})

export const getListFavorite = createAsyncThunk("/", ({ accessToken }, thunkApi) => {
    try {
        return favoriteService.getListFavorite({ accessToken })
    } catch (error) {
        const message =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkApi.rejectWithValue(message);
    }
})

export const favoriteSlice = createSlice({
    name: "favorite",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(addFavorite.pending, (state) => {
                state.isSuccess = false
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.isSuccess = true;
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.isError = true;
            })
            .addCase(deleteFavorite.pending, (state) => {
                state.isSuccess = false
            })
            .addCase(deleteFavorite.fulfilled, (state, action) => {
                state.isSuccess = true;
            })
            .addCase(deleteFavorite.rejected, (state, action) => {
                state.isError = true;
            })
            .addCase(getListFavorite.pending, (state) => {
                state.isSuccess = false
            })
            .addCase(getListFavorite.fulfilled, (state, action) => {
                state.isSuccess = true;
                state.favorites = action.payload
            })
            .addCase(getListFavorite.rejected, (state, action) => {
                state.isError = true;
            })
    }
});


export default favoriteSlice;