import { userLogin } from "../../redux/Authentication/authActions";
import authReducer from "../../redux/Authentication/authSlice";

const setAuthCookie = (token, cookieName) => {
  document.cookie = `${cookieName}=${token}; path=/; secure; SameSite=Strict`;
};
jest.fn();

describe("authenticate reducer", () => {
  const initialState = {
    isAuthenticationFailed: false,
    userInfo: null,
    isLoading: false,
    isSuccess: false,
    errorMessage: "",
    userPermissions: null,
  };

  it("should handle the pending state", () => {
    const nextState = authReducer(initialState, {
      type: userLogin.pending.type,
    });
    expect(nextState).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it("should handle the user login fullfilled", () => {
    const payload = {
      role: "admin",
      userPermissions: ["read", "write"],
      token: "mockToken",
    };
    const nextState = authReducer(initialState, {
      type: userLogin.fulfilled.type,
      payload,
    });
    expect(nextState).toEqual({
      ...initialState,
      isSuccess: true,
      isLoading: false,
    });
    expect(setAuthCookie).toHaveBeenCalledWith("mockToken", "auth_token");
  });

  it("should handle if the user login failed", () => {
    const nextState = authReducer(initialState, {
      type: userLogin.rejected.type,
    });

    expect(nextState).toEqual({
      ...initialState,
      isAuthenticationFailed: true,
      isLoading: false,
      errorMessage,
    });
  });
});
