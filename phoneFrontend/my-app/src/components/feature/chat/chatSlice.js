import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    chatId: "",
    userChat: {}
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        changeUserChat: (state, action) => {
            state.chatId = action.payload?.combinedId;
            state.userChat = action.payload?.userChat;
        }
    }
})

export const { changeUserChat } = chatSlice.actions;
export default chatSlice;