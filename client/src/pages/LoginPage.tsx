/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import LoginBG from "../assets/LoginBG.png";

type Props = {};

type LoginFormsInputs = {
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage: React.FC<Props> = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormsInputs) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.find(
      (user: LoginFormsInputs) =>
        user.userName === form.userName && user.password === form.password,
    );

    if (userExists) {
      localStorage.setItem("isLoggedIn", "true");
      alert("Login successful! Redirecting to dashboard...");
      navigate("/dashboard"); // Redirect to the dashboard
      window.location.reload(); // This will force a page refresh after navigation
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <section
      className="flex h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto mr-20 flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div
          className="w-full rounded-lg shadow sm:max-w-lg md:mb-20 xl:p-0"
          style={{ backgroundColor: "rgba(88, 85, 85, 0.285)" }}
        >
          <div className="space-y-6 p-10 sm:p-12 md:space-y-8">
            <h2 className="text-4xl font-bold text-white">Welcome!</h2>
            <p className="mb-5 text-left font-light text-white">
              Ready to learn smarter? Log in to access your dashboard!
            </p>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleLogin)}
            >
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-white dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg bg-[#719191] p-2.5 text-white sm:text-sm"
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
                  className="mb-2 block text-sm font-medium text-white dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg bg-[#719191] p-2.5 text-white sm:text-sm"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-white">{errors.password.message}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-primary-600 dark:text-primary-500 text-sm font-medium text-white hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="justify-center rounded-3xl bg-[#719191] px-8 py-2 font-bold text-white hover:bg-gray-700"
                >
                  Log in
                </button>
              </div>
              <div className="flex items-center justify-center">
                <p className="text-sm font-light text-white">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/register"
                    className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
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
