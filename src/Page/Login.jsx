import React, { useCallback, useEffect, useState } from "react";

import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";

import { DesktopLoginBg, MobileLoginBg } from "../Assests";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/Authentication/authActions";
import Button from "../Component/Common/Button";
import TextError from "../Component/Error/formError";
import { useNavigate } from "react-router-dom";
import { ErrorModal } from "../Component/Common/ErrorModal";
import { SuccessModal } from "../Component/Common/SuccessModal";
import { cleanUpError, showError } from "../redux/Error/errorSlice";
import { setMobileConfig } from "../redux/WebToNative/webToNativeSlice";
function useDeviceInfoDialog() {
  const [open, setOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const platform = useSelector((state) => state.websToNative.platform);
  const handleClick = () => {
    if (window.WTN && typeof window.WTN.deviceInfo === 'function') {
      setLoading(true);
      window.WTN.deviceInfo().then((value) => {
        setDeviceInfo(value);
        setLoading(false);
        setOpen(true);
      }).catch((err) => {
        if (
          typeof err === 'string' &&
          err.includes('This function will work in Native App Powered By WebToNative')
        ) {
          dispatch(setMobileConfig({ platform: platform }));
          alert('Good try! But this only works in the real app 😜');
        } else {
          setDeviceInfo({ error: 'Failed to get device info' });
          setLoading(false);
          setOpen(true);
        }
      });
    }
  };
  const handleClose = () => setOpen(true);
  const button = window.WTN && typeof window.WTN.deviceInfo === 'function' ? (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Get Device Info'}
    </button>
  ) : null;

  const dialog = (
    <div open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <div>Device Info</div>
      <div>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 14, margin: 0 }}>
          {deviceInfo ? JSON.stringify(deviceInfo, null, 2) : 'No data'}
        </pre>
      </div>
      <div>
        <button onClick={handleClose} color="primary">Close</button>
      </div>
    </div>
  );
  if (deviceInfo) {
    alert("device info", JSON.stringify(deviceInfo, null, 2))
  }
  // Show device info in UI if available and not an error
  const infoBox = deviceInfo && !deviceInfo.error ? (
    <Paper elevation={2} sx={{ mt: 2, p: 2, textAlign: 'left', background: '#f3f4f6', maxWidth: 480, mx: 'auto', overflowX: 'auto' }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>Device Info</Typography>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 14, margin: 0 }}>
        {JSON.stringify(deviceInfo, null, 2)}
      </pre>
    </Paper>
  ) : null;
  return { button, dialog, infoBox };
}

const LogInForm = ({ formData, formError }) => {
  const [email, setEmail] = useState("");
  const { isLoading } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deviceinfo, setDeviceInfo] = useState("");
  const [error, setError] = useState({
    invalidEmail: false,
    invalidPass: false,
  });
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{10}$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{8,}$/;
  const platform = useSelector((state) => state.websToNative.platform);
  const { button } = useDeviceInfoDialog();
  useEffect(() => {
    formData({ email, password });
    if (error.invalidEmail || error.invalidPass) {
      formError(true);
    } else {
      formError(false);
    }
  }, [email, password, error]);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);


  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-[500px] bg-white p-8 rounded-2xl">
      <div className="flex flex-col gap-3 items-center text-center">
        <h1 className="text-[32px] font-bold text-[#202224]">
          Login to Account
        </h1>
        <p className="text-[16px] text-[#202224] opacity-80">
          Please enter your email and password to continue
        </p>
      </div>

      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-2">
          <label className="text-[#202224] text-[16px] text-left" htmlFor="email">
            Email address:
          </label>
          <input
            id="email"
            name="email"
            placeholder="Enter your email or phone number"
            className="w-full px-4 py-3 border border-[#DFEAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(e.target.value);
              const isValidEmail = emailRegex.test(value);
              const isValidPhn = phoneRegex.test(value);
              setError((prev) => ({
                ...prev,
                invalidEmail: !isValidEmail && !isValidPhn,
              }));
            }}
          />
          {error?.invalidEmail && (
            <TextError>Invalid Email or Phone number</TextError>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#202224] text-[16px] text-left" htmlFor="password">
            Password:
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-[#DFEAF2] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setError((prev) => ({
                  ...prev,
                  invalidPass: !passRegex.test(value) || value === "",
                }));
                setPassword(value);
              }}
              minLength="8"
              autoComplete="new-password"
            />
            {showPassword ? (
              <PiEyeThin
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-xl"
                onClick={togglePassword}
              />
            ) : (
              <PiEyeSlashThin
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-xl"
                onClick={togglePassword}
              />
            )}
          </div>
          {error?.invalidPass && (
            <TextError>
              Password must have at least 8 characters, including uppercase,
              lowercase, a number, and a special character.
            </TextError>
          )}
        </div>
        <div>
          {button}
        </div>
        <Button
          type="submit"
          className="w-full py-3 bg-[#1570EF] text-white rounded-xl hover:bg-blue-600 transition-colors"
          disabled={error.invalidEmail || error.invalidPass}
          loading={isLoading}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [isValidationError, setIsValidationError] = useState(false);

  const formError = useCallback((data) => {
    setIsValidationError(data);
  }, []);
  const formData = useCallback((data) => {
    const { email, password } = data;
    setLoginData((prev) => ({
      ...prev,
      email,
      password,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValidationError) return;
    try {
      await dispatch(userLogin(loginData)).unwrap();
      navigate("/", {
        replace: true,
      });
    } catch (error) {
      dispatch(
        showError({
          message:
            error.data.message ||
            "Your session has expired or you are not logged in.",
          onClose: "hideError",
        })
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[40%] flex items-center justify-center p-4 relative z-10"
      >
        <ErrorModal />
        <SuccessModal />
        <LogInForm formData={formData} formError={formError} />
      </form>

      <div className="hidden md:block w-[60%] h-screen relative">
        <img
          src={DesktopLoginBg}
          alt="Login background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Mobile background - only visible on mobile */}
      <img
        src={MobileLoginBg}
        alt="Login background"
        className="absolute inset-0 w-full h-full object-cover md:hidden z-0"
      />
    </div>
  );
};


const WrapperLogin = () => {
  return <Login />;
};

export default WrapperLogin;
