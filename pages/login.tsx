import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import style from '@/styles/authStyle.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Define the interface for form data
interface IFormInput {
  email: string;
  password: string;
}

const Registration: React.FC = () => {
  // Using useForm from react-hook-form with type definition for the form inputs
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();

  const [ButtonText, setButtonText] = useState("SignIn!");
  const router = useRouter();

  // onSubmit handler with the correct type
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setButtonText("Signing in");
  
    try {
      // Attempt to login
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seller/login`, data);
      const { success, token } = response.data;
  
      // If login is successful, handle success
      if (success) {
        setButtonText("Success..");
        Cookies.set("authtokenbyan", token, { expires: 7 });
        router.push("/account");
      }
    } catch (error) {
      // Axios throws an error for non-2xx responses, so catch and handle it here
      if (axios.isAxiosError(error)) {
        // If error response is 401 Unauthorized
        if (error.response?.status === 401) {
          setError("password", {
            type: "manual",
            message: "Incorrect Password!",
          });
        } else if (error.response?.status === 404) {
          setError("email", {
            type: "manual",
            message: "Email Not Registered",
          });
        } else {
          // Handle other errors (optional)
          console.error("Unexpected error:", error.response?.status);
        }
      } else {
        console.error("Unexpected error:", error);
      }
  
      setButtonText("SignIn!");
    }
  };
  



  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>Login Form</h1>


        <div className={style.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            id="email"
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

    

        <div className={style.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            id="password"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>


        <div className={style.formGroup}>
          <button type="submit">{ButtonText}</button>
        </div>
      </form>

      <div className={style.navigatorContainer}>
        <Link href="/registration">Create New Account</Link>
      </div>
    </div>
  );
};

export default Registration;
