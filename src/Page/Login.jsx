import React, { useCallback, useEffect, useState } from "react";

import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/Authentication/authActions";
import Button from "../Component/Common/Button";
import TextError from "../Component/Error/formError";
import { useNavigate } from "react-router-dom";
import { ErrorModal } from "../Component/Common/ErrorModal";
import { SuccessModal } from "../Component/Common/SuccessModal";
import { showError } from "../redux/Error/errorSlice";
import { desktoploginIcon,mobileloginIcon } from "../Assests";

const LogInForm = ({ formData, formError }) => {
  const [email, setEmail] = useState("");
  const { isLoading } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    invalidEmail: false,
    invalidPass: false,
  });
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\d{10}$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{8,}$/;

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
    <div className="flex flex-col gap-4 md:gap-9 items-center">
      <div className="flex flex-col gap-2 md:gap-6 items-center">
        <p className="text-lg md:text-4xl font-bold text-[#202224] leading-[38.7px] ">
          Login to Account
        </p>
        <p className="text-xs sm:text-sm md:text-xl font-[500] text-[#202224] opacity-80">
          Please enter your email and password to continue
        </p>
      </div>

      <div className="flex flex-col gap-2 md:gap-4 w-full">
        <div className="flex flex-col gap-2 md:gap-3 items-start">
          <label
            className="text-[#202224] text-sm md:text-xl leading-[21.7px] opacity-80"
            htmlFor="email"
          >
            Email address:
          </label>
          <input
            id="email"
            name="email"
            placeholder="Enter your email or phone number"
            className="w-full p-4 rounded-lg border-[#EDEDED] border-2 box-border h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-xl bg-[#f1f4f9]"
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
        <div className=" flex flex-col gap-2 md:gap-3 items-start ">
          <label
            className="text-[#202224] text-sm md:text-xl leading-[21.7px] opacity-80"
            htmlFor="password"
          >
            Password:
          </label>
          <div className="relative w-full">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-4 rounded-lg border-[#EDEDED] border-2 box-border h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm md:text-xl bg-[#f1f4f9]"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                if (!passRegex.test(value) || "") {
                  setError((prev) => ({
                    ...prev,
                    invalidPass: true,
                  }));
                } else {
                  setError((prev) => ({
                    ...prev,
                    invalidPass: false,
                  }));
                }
                setPassword(value);
              }}
              minLength="8"
              autoComplete="new-password"
            />
            {showPassword ? (
              <PiEyeThin
                className="absolute right-3 transform top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={togglePassword}
              />
            ) : (
              <PiEyeSlashThin
                className="absolute right-3 transform top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={togglePassword}
              />
            )}
          </div>
        </div>
        <div className="text-left w-full">
          {error?.invalidPass && (
            <TextError>
              <p>
                Password must have at least 8 characters, including uppercase,
                lowercase, a number, and a special character.
              </p>
            </TextError>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-9 md:10 bg-[#1570EF] rounded-lg text-white"
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
    <div className="h-[100vh] w-[100vw] relative bg-white">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="relative z-10 flex items-center justify-center h-full"
      >
        <div className="flex w-full flex-col md:flex-row justify-center items-center h-full">
          <div className="flex justify-center items-center w-[80%] md:w-[45%] lg:w-[40%] p-4 md:p-8 bg-white rounded-lg md:rounded-none">
            <ErrorModal />
            <SuccessModal />
            <LogInForm formData={formData} formError={formError} />
          </div>

          <div className="hidden md:block w-[40%] md:w-[55%] lg:w-[60%] h-[100%]">
            <img
              src={desktoploginIcon}
              alt="picklebay logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </form>
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src={mobileloginIcon}
          alt="picklebay logo"
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

const WrapperLogin = () => {
  return <Login />;
};

export default WrapperLogin;
