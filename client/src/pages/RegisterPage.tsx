/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import LoginBG from "../assets/LoginBG.png";
import { useForm } from "react-hook-form";

type Props = {};

type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const RegisterPage: React.FC<Props> = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });

  const handleRegister = (form: RegisterFormsInputs) => {
    // Simulate registering the user and saving in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({
      email: form.email,
      userName: form.userName,
      password: form.password,
    });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please log in.");
    navigate("/login"); // Redirect to the login page
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
                  className="mb-2 block text-sm font-medium text-white dark:text-white"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg bg-[#719191] p-2.5 text-white sm:text-sm"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-white">{errors.email.message}</p>
                )}
              </div>
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
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="rounded-3xl bg-[#719191] px-8 py-2 font-bold text-white hover:bg-gray-700"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <div className="mt-4 flex items-center justify-center">
              <p className="text-sm font-light text-white">
                Already have an account?{" "}
                <span
                  className="text-primary-600 cursor-pointer font-medium hover:underline"
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
