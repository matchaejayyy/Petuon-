/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import LoginBG from "../assets/LoginBG.png";
import axios from "axios";
import { LoginFormsInputs, Props } from "../types/LoginTypes";

const validation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage: React.FC<Props> = () => {
  const [error, setError] = useState<string | null>(null); // Track error message in state
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = async (form: LoginFormsInputs) => {
    try {
      const response = await axios.post('http://localhost:3002/login', {
        userName: form.userName,
        password: form.password,
      });

      if (response.data.token) {
        // Store JWT token in a state variable or in cookies (securely)
        // For now, we'll use state to store it
        const token = response.data.token;

        // Optionally, store the token in a more persistent storage (cookies) if needed

        // Show success message and navigate to dashboard
        alert("Login successful! Redirecting to dashboard...");
        navigate("/dashboard");
      }
    } catch (error: any) {
      // Handle error (e.g., invalid username/password)
      setError(error.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <section
      className="h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mr-20">
      <div className="w-full rounded-lg shadow md:mb-20 sm:max-w-lg xl:p-0" style={{ backgroundColor: "rgba(88, 85, 85, 0.285)" }}>
          <div className="p-10 space-y-6 md:space-y-8 sm:p-12">
            <h2 className="text-4xl font-bold text-white">Welcome!</h2>
            <p className="text-left font-light text-white mb-5">
              Ready to learn smarter? Log in to access your dashboard!
            </p>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleLogin)}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-white dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Username"
                  {...register("userName")}
                />
                {errors.userName && (
                  <p className="text-white">{errors.userName.message}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-white">{errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-sm text-white font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="bg-[#719191] justify-center hover:bg-gray-700 text-white font-bold py-2 px-8 rounded-3xl"
                >
                  Log in
                </button>
              </div>
              <div className="flex justify-center items-center">
                <p className="text-sm font-light text-white">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
