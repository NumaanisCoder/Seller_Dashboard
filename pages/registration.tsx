import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import style from '@/styles/authStyle.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Define the interface for form data
interface IFormInput {
  name: string;
  businessName:string;
  email: string;
  gst: string;
  phone: string;
  address:string;
  warehouseAddress:string;
  password: string;
  cpassword: string;
}

const Registration: React.FC = () => {
  // Using useForm from react-hook-form with type definition for the form inputs
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IFormInput>();
  const router = useRouter();
  const [ButtonText, setButtonText] = useState("SignUp!");

  // onSubmit handler with the correct type
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
   setButtonText("Signing...");

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/seller/register`, data);
    const {success, token} = response.data;
    if(success){
      Cookies.set("authtokenbyan",token, {expires: 7})
      router.push("/login");
    }

    // Password match check can be done here if needed
    if (data.password !== data.cpassword) {
      alert('Passwords do not match!');
    } else {
      alert('Form submitted successfully!');
    }
  };

  return (
    <div className={style.container}>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        <h1>Registration Form</h1>

        <div className={style.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            {...register('name', { required: 'Name is required'})}
            id="name"
            maxLength={30}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div className={style.formGroup}>
          <label htmlFor="name">Business Name</label>
          <input
            {...register('businessName', { required: 'businessName is required'})}
            id="name"
            maxLength={30}
          />
          {errors.businessName && <span>{errors.businessName.message}</span>}
        </div>


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
          <label htmlFor="gst">GST Number</label>
          <input
          style={{textTransform: "uppercase"}}
            {...register('gst', { required: 'GST number is required', 
            minLength: {
                value: 15,
                message: 'GST number must be exactly 15 characters'
              },
              maxLength: {
                value: 15,
                message: 'GST number must be exactly 15 characters'
              } , max: 15})}
            id="gst"
            onChange={(e) => e.target.value = e.target.value.toUpperCase()}
            maxLength={15}
            onKeyDown={(e) => {
                if (e.key === ' ') {
                  e.preventDefault(); // Disable spacebar
                }
              }}
          />
          {errors.gst && <span>{errors.gst.message}</span>}
        </div>
        <div className={style.formGroup}>
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            {...register('phone', { required: 'Phone Number is required', minLength:{value:10, message: "Number must me 10 digits"}, maxLength:{value: 10,message: "Number must me 10 digits"} })}
            id="phoneNumber"
          />
          {errors.phone && <span>{errors.phone.message}</span>}
        </div>

        <div className={style.formGroup}>
          <label htmlFor="username">Address</label>
          <input
            {...register('address', { required: 'Address is required'})}
            id="username"
            minLength={10}
          />
          {errors.address && <span>{errors.address.message}</span>}
        </div>
        <div className={style.formGroup}>
          <label htmlFor="warehouse">Warehouse Address</label>
          <input
            {...register('warehouseAddress', { required: 'Warehouse Address is required'})}
            id="warehouse"
            minLength={10}
          />
          {errors.warehouseAddress && <span>{errors.warehouseAddress.message}</span>}
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
          <label htmlFor="cpassword">Confirm Password</label>
          <input
            type="password"
            {...register('cpassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === watch('password') || 'Passwords do not match',
            })}
            id="cpassword"
          />
          {errors.cpassword && <span>{errors.cpassword.message}</span>}
        </div>

        <div className={style.formGroup}>
          <button type="submit">{ButtonText}</button>
        </div>
      </form>
      <div className={style.navigatorContainer}>
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
};

export default Registration;
