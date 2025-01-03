import { userLogin } from "../../redux/Authentication/authActions";

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../../redux/Authentication/authSlice";

describe("authSlice async actions", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  it("dispatches pending and fulfilled for a successful login", async () => {
    const mockResponse = {
      role: "admin",
      userPermissions: ["read", "write"],
      token: "mockToken",
    };

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    await store.dispatch(
      userLogin({ email: "test@example.com", password: "password" })
    );

    const state = store.getState().auth;
    expect(state.isLoading).toBe(false);
    expect(state.isSuccess).toBe(true);
    expect(state.userInfo).toBe("admin");
  });

  it("dispatches pending and rejected for a failed login", async () => {
    const mockError = "Invalid credentials";

    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: mockError }),
      })
    );

    await store.dispatch(
      userLogin({ email: "wrong@example.com", password: "wrongpassword" })
    );

    const state = store.getState().auth;
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticationFailed).toBe(true);
    expect(state.errorMessage).toBe(mockError);
  });
});
