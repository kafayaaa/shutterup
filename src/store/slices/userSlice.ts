import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
}

const initialState: UserState = {
  profile: null,
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
      state.isLoading = false;
    },
    clearProfile(state) {
      state.profile = null;
      state.isLoading = false;
    },
  },
});

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
