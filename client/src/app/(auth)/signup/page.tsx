"use client"
import { useSignUpUserMutation } from "@/state/api";
import { useState } from "react";
import {newUser} from "@/state/api";
import { Eye, EyeOff , ImageDown, Loader, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {};

const SignUpPage = (props: Props) => {
  const [signUpForm , setSignUpForm] = useState<newUser>({
    email:"",
    username:"",
    password:"",
    profilePictureUrl:""
  })

  const [ispasswordSeen , setIsPasswordSeen] = useState(false);
  const [isError , setIsError] = useState(false);
  const [SignUpUser , {data , isLoading , error}] = useSignUpUserMutation();
  const [imagePreview , setImagePreview] = useState <string | null>(null);

  const router = useRouter();

  //  trigger on form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpForm.profilePictureUrl) {
      alert("Image not uploaded yet!");
      return;
    }

    try {
      const checkSignup = await SignUpUser(signUpForm);
      if(checkSignup?.error){
        throw new Error("Error in Signing in from backend");
      }
      router.push('/login');
    } catch (error) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/s3url`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          fileName: signUpForm.profilePictureUrl
        })
      })
      setIsError(true);
      console.log(error);
      setSignUpForm({
        email:"",
        username:"",
        password:"",
        profilePictureUrl:""
      })
      setImagePreview("");
      // Clear error after 5 seconds
      setTimeout(() => {
        setIsError(false);
      }, 2000);
    }
  };
  // trigger on submisson of image 
  const handleImageUpload = async (e:React.ChangeEvent <HTMLInputElement>) =>{
   const file = e.target.files?.[0];
   
    if(!file) return;
    // show preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/s3url`,{
        method: "POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type
        })
      });

      const {url} = await res.json();

      const upload = await fetch(url,{
        method:"PUT",
        headers:{
          "Content-Type": file.type,
        },
        body:file,
      })
      console.log(upload);

      if (!upload.ok) {
        throw new Error("Upload failed");
      }

       // 3. Save S3 public URL (remove query params)
       const publicUrl = url.split("?")[0];
       
       setSignUpForm((prev) => ({
        ...prev,
        profilePictureUrl: file.name,
      }));

    } catch (error) {
      console.error("Image upload error", error);
      setImagePreview(null);
    }
  };

  return (
    <div
     className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-blue-400 to-pink-500"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-8">SignUp</h1>
        {/*username field*/}
        <div className="block mb-4 text-gray-700">
          <span className="text-sm">Username</span>
          <div className="mt-1 relative">
            <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Type your username"
              value={signUpForm.username}
              onChange={(e) => setSignUpForm({...signUpForm , username:e.target.value})}
              className={`pl-10 pr-3 py-2 w-full border-b ${isError?"border-red-600":"border-gray-300"} focus:outline-none focus:border-blue-500 transition`}
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="block mb-4 text-gray-700">
          <span className="text-sm">Email</span>
          <div className="mt-1 relative">
            <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Type your email"
              value={signUpForm.email}
              onChange={(e) => setSignUpForm({...signUpForm , email:e.target.value})}
              className={`pl-10 pr-3 py-2 w-full border-b ${isError?"border-red-600":"border-gray-300"} focus:outline-none focus:border-blue-500 transition`}
              required
            />
          </div>
        </div>
        
        {/* ProfilePicturUrl */}
        <div className="block mb-4 text-gray-700 relative">
          <span className="text-sm">Your Image</span>
          <div className="mt-1 relative">
            <ImageDown className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="file"
              placeholder="put your image"
                onChange={(e) =>{
                e.preventDefault() 
                 handleImageUpload(e);
              }}
              className={`pl-10 pr-3 py-2 w-full border-b ${isError?"border-red-600":"border-gray-300"} focus:outline-none focus:border-blue-500 transition`}
              required
            />
            {imagePreview && (
              <div className="mt-4 text-center absolute -top-[3.3rem] right-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover mx-auto border border-gray-300"
                  />
              </div>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="block  text-gray-700 mb-6">
          <span className="text-sm">Password</span>
          <div className="mt-1 relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={ispasswordSeen?"text":"password"}
              placeholder="Type your password"
              value={signUpForm.password}
              onChange={(e) => setSignUpForm({...signUpForm , password:e.target.value})}
              className={`pl-10 pr-3 py-2 w-full border-b ${isError?"border-red-600":"border-gray-300"} focus:outline-none focus:border-blue-500 transition`}
              // className="pl-10 pr-3 py-2 w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 transition"
              required
            />
           { signUpForm.password.length > 2 ?(
            <button 
             className="absolute right-8 top-1/2 -translate-y-1/2 opacity-45"
              onClick={(e) =>{
              e.preventDefault() 
              setIsPasswordSeen((prev)=> !prev)}}>
              {ispasswordSeen? <Eye size={16}/> : <EyeOff size={20}/> }
            </button>):""
           }
          </div>
        </div>
     
        {/* <div className="text-right mb-6">
          <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
            Forgot password?
          </a>
        </div> */}

        {/* Login Button */}
        <button
          type="submit"
          className="w-full  rounded-full  min-h-[30px] flex justify-center items-center bg-gradient-to-r from-blue-400 to-pink-500 text-white font-semibold shadow-md hover:opacity-90 transition"
        >
         {isLoading?<Loader size={"10"}/>:"SingUp"}
        </button>
         
        {/* Social Login */}
        {/* <div className="mt-8 text-center text-gray-500 text-sm">
          Or Sign Up Using
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white">
              {/* Facebook */}
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-3v-3h3v-2.3c0-3 1.8-4.7 4.5-4.7 1.3 0 2.6.2 2.6.2v3h-1.6c-1.6 0-2.1 1-2.1 2v2h3.6l-.6 3h-3v7A10 10 0 0 0 22 12z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-400 text-white">
              {/* Twitter */}
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.6a9.8 9.8 0 0 1-2.8.8 4.9 4.9 0 0 0 2.1-2.7 9.8 9.8 0 0 1-3.1 1.2 4.9 4.9 0 0 0-8.4 4.5A13.9 13.9 0 0 1 1.7 3.1a4.9 4.9 0 0 0 1.5 6.6 4.9 4.9 0 0 1-2.2-.6v.1a4.9 4.9 0 0 0 3.9 4.8 4.9 4.9 0 0 1-2.2.1 4.9 4.9 0 0 0 4.6 3.4A9.9 9.9 0 0 1 0 19.5a13.9 13.9 0 0 0 7.5 2.2c9.1 0 14.1-7.5 14.1-14v-.6A10 10 0 0 0 24 4.6z"/></svg>
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white"> */}
              {/* Google */}
              {/* <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 533.5 544.3"><path fill="#fff" d="M533.5 278.4c0-17.3-1.4-34-4-50.2H272v95h146.9c-6.3 34-25 62.8-53.3 82v68.1h86.1c50.4-46.4 80-115 80-194.9z"/><path fill="#4285F4" d="M272 544.3c72.8 0 134-24.1 178.7-65.4l-86.1-68.1c-24 16-54.5 25.4-92.6 25.4-71 0-131-47.8-152.5-112.2H32.4v70.4C77 481.1 167.7 544.3 272 544.3z"/><path fill="#34A853" d="M119.4 323.9c-5.2-15.4-8.2-31.8-8.2-48.6s3-33.2 8.2-48.6v-70.4H32.4C11.6 207 0 241.1 0 278.4s11.6 71.4 32.4 100.1l87-54.6z"/><path fill="#FBBC05" d="M272 109.7c39.6 0 75.3 13.7 103.4 40.5l77.4-77.4C403.9 24.1 342.7 0 272 0 167.7 0 77 63.2 32.4 158.1l87 54.6c21.5-64.4 81.5-112.2 152.6-112.2z"/></svg>
            </a>
          </div>
        </div> */}

        {/* Footer Sign Up Link */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Or You Have Already Account
          <div className="mt-2">
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignUpPage;
