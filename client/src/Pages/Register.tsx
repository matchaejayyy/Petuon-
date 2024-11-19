import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../Context/userAuth";
import LoginBG from "../assets/LoginBG.png";
import { useForm } from "react-hook-form";
type Props = {};

type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const RegisterPage = (props: Props) => {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: RegisterFormsInputs) => {
    registerUser(form.email, form.userName, form.password);
  };
  return (
    <section className=" h-screen flex items-center justify-center"
    style={{
        backgroundImage: `url(${LoginBG})`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
        }}>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mr-20">
        <div className="w-full rounded-lg shadow md:mb-20 sm:max-w-lg xl:p-0 bg-customGray">
          <div className="p-8 space-y-6 md:space-y-8 sm:p-10">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
              Create your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleLogin)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-white">{errors.email.message}</p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  placeholder="Username"
                  {...register("userName")}
                />
                {errors.userName ? (
                  <p className="text-white">{errors.userName.message}</p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-[#719191] text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="text-white">{errors.password.message}</p>
                ) : (
                  ""
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
              <div className ="flex justify-center items-center">
              <button
                type="submit"
                className="bg-[#719191] justify-center  hover:bg-gray-700 text-white font-bold py-2 px-8 rounded-3xl"
              >
                Sign in
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;