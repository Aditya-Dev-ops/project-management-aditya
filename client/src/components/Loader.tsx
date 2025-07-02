import React from "react";

const Loader = ({size}:{size:string}) => {
  return (
    <div className="flex justify-center items-center h-[100%] w-[100%]">
      <div className="border-4 border-t-transparent border-yellow-50 rounded-full animate-spin w-5 h-5" />
    </div>
  );
};

export default Loader;
