import React, { useState } from "react";
// import * as Yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import LoginBG from "../assets/LoginBg.png";

import axios from "axios";
import { LoginFormsInputs, Props } from "../types/LoginTypes";
import LogInOut from "../components/logInOutComponent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const LoginPage: React.FC<Props> = () => {
  const [error, setError] = useState<string | null>(null); // Track error message
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({
    // resolver: yupResolver(validationSchema),
  });

  
  const handleLogin = async (form: LoginFormsInputs) => {
    try {

        setLoading(true);
        const response = await axios.post("http://localhost:3002/login/userLogin", {
          user_name: form.user_name,
          user_password: form.user_password,

        });

        if (response.data.token) {
          // Store JWT token in localStorage for persistent sessions
          localStorage.setItem("token", response.data.token);

          // alert("Login successful! Redirecting to dashboard...");
          toast.success("Login successful! Redirecting to dashboard...");

      // Redirect to the dashboard after showing the notification
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } 

    } catch (error: unknown) {
      toast.error("Failed to login, pls try again.")
      setLoading(false);
      if (axios.isAxiosError(error)) {
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  


  return (
    <>
     <ToastContainer
        position="top-center" // This makes the toast appear at the top center
        autoClose={3000} // Adjust the auto-close time if needed
        hideProgressBar={false} // Show the progress bar
        newestOnTop={true} // New toasts appear at the top of the stack
        closeOnClick // Close on click
        rtl={false} // Set to true for right-to-left layout
        pauseOnFocusLoss
        draggable
      />
    {loading && (
      
      <LogInOut/>
    )}
   
    <section  
      className="flex h-screen items-center justify-center"

      style={{
        backgroundImage: `url(${LoginBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mr-20">
        <div
          className="w-full rounded-lg shadow md:mb-20 sm:max-w-lg xl:p-0"
          style={{ backgroundColor: "rgba(88, 85, 85, 0.285)" }}
        >
          <div className="p-10 space-y-6 md:space-y-8 sm:p-12">
            <h2 className="text-4xl font-bold text-white">Welcome!</h2>
            <p className="text-left font-light text-white mb-5">
              Ready to learn smarter? Log in to access your dashboard!
            </p>
            {error && <p className="text-red-500">{error}</p>}
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleLogin)}
            >
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Username"
                  {...register("userName")}
                />
                {errors.userName && <p className="text-white">{errors.userName.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  {...register("password")}
                />
                {errors.password && <p className="text-white">{errors.password.message}</p>}
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
    </>
  );
};

export default LoginPage;