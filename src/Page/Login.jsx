import React, { useCallback, useEffect, useState } from "react";

import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";

import { loginImage } from "../Assests";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/Authentication/authActions";
import Button from "../Component/Common/Button";
import TextError from "../Component/Error/formError";
import { useNavigate } from "react-router-dom";
import { cleanUpSuccess, showSuccess } from "../redux/Success/successSlice";
import { ErrorModal } from "../Component/Common/ErrorModal";
import { SuccessModal } from "../Component/Common/SuccessModal";
import { cleanUpError, showError } from "../redux/Error/errorSlice";

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
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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
    <div className="flex flex-col gap-[37px] items-center ">
      <div className="flex flex-col gap-[15px] items-center">
        <p className="text-[32px] font-[700] text-[#202224] leading-[38.7px] ">
          Login to Account
        </p>
        <p className="text-[18px] font-[500] text-[#202224] leading-[21.7px]">
          Please enter your email and password to continue
        </p>
      </div>

      <div className="flex flex-col gap-[30px] w-full">
        <div className="flex flex-col gap-[5px] items-start">
          <label
            className="text-[#202224] text-[18px] leading-[21.7px] "
            htmlFor="email"
          >
            Email address:
          </label>
          <input
            id="email"
            name="email"
            placeholder="Enter your email or phone number"
            className=" w-full p-[10px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[45px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className=" flex flex-col gap-[5px] items-start ">
          <label
            className="text-[#202224] text-[18px] leading-[21.7px] "
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
              className=" w-full text-[18px] p-[10px] border-[1px] border-[#DFEAF2] rounded-[15px] h-[45px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full h-[45px] bg-[#1570EF]  rounded-[10px]"
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const { accessToken, refreshToken, isSuccess } = useSelector(
    (state) => state.auth
  );

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
      navigate("/venues", {
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
    <div className="h-[100vh] flex justify-center  portrait:rotate-0 landscape:rotate-360 ">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="grid grid-cols-3 place-items-center gap-[47px]">
          <div className="col-span-1 flex justify-center items-center pl-[47px] min-w-[200px] max-w-[400px]">
            <ErrorModal />
            <SuccessModal />
            <LogInForm formData={formData} formError={formError} />
          </div>

          <div className="col-span-2 w-full">
            <img
              src={loginImage}
              alt="picklebay logo"
              className="h-[100vh] w-full object-cover"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
