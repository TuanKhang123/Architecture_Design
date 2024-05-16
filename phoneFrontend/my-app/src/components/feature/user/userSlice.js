import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from './userService';

const accessToken = localStorage.getItem('accessToken');

const initialState = {
  user: null,
  listUser: [],
  accessToken: accessToken ? accessToken : null,
  isError: false,
  success: false,
  success2: false,
  isLoading: false,
  message: '',
};

export const registerUser = createAsyncThunk(
  '/register',
  async ({ firstname, lastname, avatar, phonenumber, email, password }, thunkAPI) => {
    try {
      return userService.registerUser({
        firstname,
        lastname,
        avatar,
        phonenumber,
        email,
        password,
      });
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk('/login', async ({ email, password }, thunkAPI) => {
  try {
    return userService.loginUser({ email, password });
  } catch (error) {
    const message =
      (error.respone && error.respone.data && error.respone.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const forgotPassword = createAsyncThunk('/forgotpassword', async ({ email }, thunkAPI) => {
  try {
    return userService.forgotPassword({ email });
  } catch (error) {
    const message =
      (error.respone && error.respone.data && error.respone.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const changePassword = createAsyncThunk(
  '/changepassword/:accessToken',
  async ({ password, retypeNewPassword }, thunkAPI) => {
    try {
      return userService.changePassword({ password, retypeNewPassword });
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUser = createAsyncThunk('/getuser', async (accessToken, thunkAPI) => {
  try {
    return userService.getUser(accessToken);
  } catch (error) {
    const message =
      (error.respone && error.respone.data && error.respone.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getUsers = createAsyncThunk('/getusers', async (accessToken, thunkAPI) => {
  try {
    return userService.getUsers(accessToken);
  } catch (error) {
    const message =
      (error.respone && error.respone.data && error.respone.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateUser = createAsyncThunk(
  '/updateuser',
  async ({ fullname, email, phonenumber, gender, days, months, years, accessToken }, thunkAPI) => {
    try {
      return userService.updateUser({
        fullname,
        email,
        phonenumber,
        gender,
        days,
        months,
        years,
        accessToken,
      });
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateDetailAddress = createAsyncThunk(
  '/updateDetailAddress',
  async (data, thunkAPI) => {
    try {
      return userService.updateDetailAddress(data);
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createNewPassword = createAsyncThunk(
  '/createnewpassword',
  async ({ curpass, newpass, accessToken }, thunkAPI) => {
    try {
      return userService.createNewPassword({ curpass, newpass, accessToken });
    } catch (error) {
      const message =
        (error.respone && error.respone.data && error.respone.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.success = false;
      state.isLoading = false;
      state.message = '';
    },
    logout: (state) => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      state.isError = false;
      state.success = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    //register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.success = true;
        state.isLoading = false;
        state.message = 'Register is successfully';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.message = 'Register is failed';
      })
      //login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = 'Occupied Error';
      })
      //forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.user = action.payload;
        state.message = 'Please check your email';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = 'Invalid Email';
      })
      //change password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      //get user
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.success = true;
        state.user = action.payload;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isError = true;
        state.success = false;
      })
      //get users
      .addCase(getUsers.fulfilled, (state, action) => {
        state.listUser = action.payload;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isError = true;
      })
      // createnewpassword
      .addCase(createNewPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.success = false;
        state.success2 = false;
      })
      .addCase(createNewPassword.fulfilled, (state, action) => {
        state.success = true;
        state.success2 = true;
        state.isError = false;
      })
      .addCase(createNewPassword.rejected, (state, action) => {
        state.success = false;
        state.success2 = false;
        state.isError = true;
      });
  },
});

export const { reset, logout } = userSlice.actions;
export default userSlice;
