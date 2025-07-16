"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./authProvider";
import { useAppSelector } from "@/app/redux";
import { useDispatch, UseDispatch } from "react-redux";
import { setError } from "@/state";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const {isSidebarCollapsed , isDarkMode , isError , Error }= useAppSelector(
    (state) => state.global
  );
 const dispatch = useDispatch();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
        
      <Sidebar />
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "sm:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
  );
};

export default DashboardWrapper;
