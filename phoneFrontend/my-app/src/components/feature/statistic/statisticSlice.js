import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import statisticService from "./statisticService";


const initialState = {
    cateRenevue: [],
    topBestSelling: [],
    monthlyRevenue: [],
};

export const getMonthlyRevenue = createAsyncThunk(
    "/getMonthlyRevenue",
    async ({ data }, thunkApi) => {
        try {
            return statisticService.getMonthlyRevenue({ data });
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
)

export const getCateRevenue = createAsyncThunk(
    "/getCateRevenue",
    async ({ data }, thunkApi) => {
        try {
            return statisticService.getCateRevenue({ data });
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
)

export const getTopBestSelling = createAsyncThunk(
    "/getTopBestSelling",
    async ({ data }, thunkApi) => {
        try {
            return statisticService.getTopBestSelling({ data });
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
)

export const statisticSlice = createSlice({
    name: 'statistic',
    initialState,
    reducers: {
        resetAll: (state) => {
            state.monthlyRevenue = [];
            state.cateRenevue = [];
            state.topBestSelling = [];
        },
        resetRemaining: (state) => {
            state.cateRenevue = [];
            state.topBestSelling = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMonthlyRevenue.fulfilled, (state, action) => {
                state.monthlyRevenue = action?.payload
            })
            .addCase(getCateRevenue.fulfilled, (state, action) => {
                state.cateRenevue = action?.payload
            })
            .addCase(getTopBestSelling.fulfilled, (state, action) => {
                state.topBestSelling = action?.payload
            })
    }
})

export const { resetAll, resetRemaining } = statisticSlice.actions;
export default statisticSlice;