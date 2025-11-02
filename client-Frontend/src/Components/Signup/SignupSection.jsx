import axios from "axios";
import React, { useState } from "react";
import { useSnackbar } from "../SnackBar";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

function SignupSection() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  
  const password = watch("password");

  // Handle signup
  const signup = async (data) => {
    const signupPayload = {
      email: data.email,
      password: data.password,
      role: data.role,
    };
    setLoading(true);

    try {
      // Check if backend URL is set
      if (!baseURL) {
        showSnackbar({ message: "Backend URL not configured. Please check your environment variables.", useCase: "error" });
        setLoading(false);
        return;
      }

      console.log("Signup payload:", signupPayload);
      console.log("Backend URL:", baseURL);

      const response = await axios.post(`${baseURL}/auth/signup`, signupPayload, {
        withCredentials: true,
      });

      if (response.status === 201) {
        showSnackbar({ message: "Account created successfully! Please login.", useCase: "success" });
        // Redirect to login page after successful signup
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Signup error:", error);
      
      // More detailed error handling
      let errorMessage = "Signup failed. Try again later.";
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || errorMessage;
        console.error("Server error response:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Cannot reach server. Please check if backend is running.";
        console.error("No response received:", error.request);
      } else {
        // Something else happened
        errorMessage = error.message || errorMessage;
        console.error("Error setting up request:", error.message);
      }
      
      showSnackbar({ message: errorMessage, useCase: "error" });
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
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(signup)}>
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
                  placeholder="name@lnmiit.ac.in"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
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
                  placeholder="••••••••"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: value => value === password || "Passwords do not match"
                  })}
                />
                {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>}
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <select
                  id="role"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  {...register("role", { required: "Please select a role" })}
                >
                  <option value="">Select a role</option>
                  <option value="gsec">GSEC</option>
                  <option value="facultyMentor">Faculty Mentor</option>
                  <option value="assistantRegistrar">Assistant Registrar</option>
                  <option value="systemAdministrator">System Administrator</option>
                  <option value="guard">Guard</option>
                </select>
                {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-blue-400 disabled:dark:bg-blue-500 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
              
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignupSection;

