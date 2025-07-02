'use client'

import { useCheckOtpMutation } from "@/state/api";
import { Loader, MessageCircleCode } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OtpPage = () => {
    const [otp , setOtp] = useState("");
    const [checkOtp , {data , isLoading ,error}] = useCheckOtpMutation();
    const router = useRouter();
    const handleSubmit = async (e:  React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault()
       try {
        const data = await checkOtp({userotp : otp})
        console.log(data);
        if(!data.error){
         router.push('/login')
        }
       } catch (error) {
        console.log(error);
        setOtp("")
       }
    };

  return (
    <div
    className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-400 to-pink-500"
    >
     <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
     >

      <h1 className="text-center text-2xl font-bold mb-5">
        OTP
      </h1>
         <div className="block mb-4 text-gray-700">
           <span className="text-sm">OTP</span>
           <div className="mt-1 relative">
             <MessageCircleCode  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20}/>
             <input type="text"
              maxLength={6}
              value={otp}
              onChange={(e)=> setOtp(e.target.value)}
              className={`pl-10 pr-3 py-2 w-full border-b ${otp.length > 5 ? "border-gray-300" : "border-red-600"} focus:outline-none focus:border-blue-500 transition`}
             />
           </div>
         </div>

         <button
          type="submit"
          className={`w-full rounded-full min-h-[25px] flex justify-center items-center bg-gradient-to-r from-blue-400 to-pink-500 text-white font-semibold shadow-md mt-4 hover:opacity-90 transition ${otp.length <= 5?"cursor-not-allowed":""}`}
          disabled={otp.length > 5?false : true}
         >

         {isLoading?<Loader size={"10"}/>:"Click Me"} 
         </button>
     </form>  
    </div>
  )
}

export default OtpPage;