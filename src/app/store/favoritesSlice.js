import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFavorites = createAsyncThunk("favorites/fetchFavorites", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("http://localhost:3000/api/subscriptions/me/posts", {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load subscriptions");
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addFavorite = createAsyncThunk("favorites/addFavorite", async (postId, { rejectWithValue }) => {
  try {
    const res = await fetch(`http://localhost:3000/api/subscriptions/posts/${postId}`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to subscribe");
    return postId;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const removeFavorite = createAsyncThunk("favorites/removeFavorite", async (postId, { rejectWithValue }) => {
  try {
    const res = await fetch(`http://localhost:3000/api/subscriptions/posts/${postId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to unsubscribe");
    return postId;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (!state.items.some((p) => p.id === action.payload)) {
          state.items.push({ id: action.payload });
        }
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export default favoritesSlice.reducer;
