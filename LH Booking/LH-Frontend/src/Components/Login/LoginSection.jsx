import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "../SnackBar";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../config/Firebase";
import { signInWithPopup } from "firebase/auth";

function LoginSection() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  // Handle traditional email/password login
  const login = async (data) => {
    const loginPayload = {
      email: data.email,
      password: data.password,
    };
    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/auth/login`, loginPayload, {
        withCredentials: true,
      });

      if (response.status === 200) {
        const { role, id, email } = response.data.user;

        // Save user details in localStorage
        localStorage.setItem("role", role);
        localStorage.setItem("id", id);
        localStorage.setItem("email", email);

        // Navigate based on role
        if (
          role === "assistantRegistrar" ||
          role === "systemAdministrator" ||
          role === "facultyMentor"
        ) {
          navigate("/requests");
        } else if (role === "gsec") {
          navigate("/book");
        } else {
          navigate("/");
        }

        showSnackbar({ message: "Logged in successfully", useCase: "success" });
      } else if (response.status === 401) {
        showSnackbar({ message: "Invalid Credentials", useCase: "error" });
      }
    } catch (error) {
      showSnackbar({ message: "Login failed. Try again later.", useCase: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      // Check email domain restriction
      if (!email.endsWith("lnmiit.ac.in")) {
        showSnackbar({ message: "Only LNMIIT emails are allowed.", useCase: "error" });
        auth.signOut();
        return;
      }

      // Handle post-login navigation
      localStorage.setItem("email", email);
      navigate("/book");
      showSnackbar({ message: "Google Sign-In successful", useCase: "success" });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      showSnackbar({ message: "Google Sign-In failed. Try again later.", useCase: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          LNMIIT LH Management
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(login)}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-blue-400 disabled:dark:bg-blue-500 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              {/* <button
                type="button"
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full flex justify-center text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 disabled:bg-red-400 disabled:dark:bg-red-500 disabled:cursor-not-allowed"
              >
                Sign in with Google
              </button> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginSection;
