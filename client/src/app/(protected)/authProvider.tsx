'use client';

import React from "react";
import { useAppSelector } from "@/app/redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const formFields = {
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      inputProps: { required: true },
    },
    email: {
      order: 1,
      placeholder: "Enter your email address",
      label: "Email",
      inputProps: { type: "email", required: true },
    },
    password: {
      order: 3,
      placeholder: "Enter your password",
      label: "Password",
      inputProps: { type: "password", required: true },
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      inputProps: { type: "password", required: true },
    },
  },
};


const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const token = useAppSelector((state)=> state.auth.token);
  console.log(token);
  const router = useRouter();
  useEffect(()=>{
    if(!token){
      router.push("/login");// redirect if no token
    }
  },[token , router]);

  if(!token) return null;

  return (
    <>
    {children}
    </>
  );
};

export default AuthProvider;