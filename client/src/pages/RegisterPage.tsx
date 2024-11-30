/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import LoginBG from "../assets/LoginBG.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { RegisterFormsInputs, Props } from "../types/RegisterTypes";


const validation = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });


  const handleRegister = async (form: RegisterFormsInputs) => {
    try {
      const response = await axios.post('http://localhost:3002/register', form);

      // Handle successful registration
      alert(response.data.message); // This will show the success message from the backend
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error: any) {
      // Handle error from the API
      if (error.response) {
        // Server-side error
        alert(`Error: ${error.response.data.error}`);
      } else {
        // Network or other error
        console.error('Error registering user:', error);
        alert('An error occurred. Please try again.');
      }
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
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl dark:text-white">
              Create your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleRegister)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-white dark:text-white"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="Email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-white">{errors.email.message}</p>
                )}
              </div>
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
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className="bg-[#719191] hover:bg-gray-700 text-white font-bold py-2 px-8 rounded-3xl"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="flex justify-center items-center mt-4">
              <p className="text-sm font-light text-white">
                Already have an account?{" "}
                <span
                  className="font-medium text-primary-600 hover:underline cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
