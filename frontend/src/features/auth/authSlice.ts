import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "member";

export interface User {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface SetCredentialsPayload {
  user: User;
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Helper to normalize role from backend ('librarian' -> 'admin')
export const normalizeRole = (role?: string): UserRole => {
  if (!role) return "member";
  const lower = role.toLowerCase();
  if (lower === "librarian" || lower === "admin") return "admin";
  return "member";
};

// Safely retrieve stored user and token
const getInitialState = (): AuthState => {
  try {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.role = normalizeRole(parsedUser.role);
      return {
        user: parsedUser,
        token: storedToken,
        isAuthenticated: true,
      };
    }
  } catch (e) {
    console.error("Failed to parse stored auth session:", e);
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token?: string } | User>
    ) => {
      let userObj: User;
      let tokenStr: string | undefined;

      if ("user" in action.payload) {
        userObj = { ...action.payload.user };
        tokenStr = action.payload.token;
      } else {
        userObj = { ...action.payload };
      }

      userObj.role = normalizeRole(userObj.role);
      state.user = userObj;
      state.isAuthenticated = true;

      if (tokenStr) {
        state.token = tokenStr;
        localStorage.setItem("token", tokenStr);
      }
      localStorage.setItem("user", JSON.stringify(userObj));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;