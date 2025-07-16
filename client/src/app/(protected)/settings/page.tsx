'use client'
import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { setError, setMessage } from "@/state";
import { useGetAuthUserQuery, useGetTeamsQuery, useGetUsersQuery, User, useUpdateUserMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, UseDispatch } from "react-redux";

const roles = [
  "Project Manager" ,"Business Analyst" ,"Delivery Manager" , "Product Owner" , "Software Developer" , "QA/Tester" , "DevOps Engineer" , "Database Administrator" , "UI/UX" , "Not-Defined"
];

const Settings = () => {
  const [isedit , setIsEdit] = useState<{[key:string]:boolean}>({
    username:true,
    email:false,
    teamId:false,
    Role:false
  });

  const dispatch = useDispatch();

  //For Getting User Email 
  const currentUserEmail:string | null = useAppSelector(
    (state)=>state.auth.email,
  );
 
  // For Getting User Dsta
  let { data: userSettings , isLoading , isError} = useGetAuthUserQuery(currentUserEmail!,{
    skip:!currentUserEmail,
  });
  
  // For Update User Data 
  const [updateUser , {data:UpdateUserData , isLoading:isLoadingUserUpdate ,isError:isErrorUserUpdate}] = useUpdateUserMutation();

//  For Gettting Team Data
  const {data:TeamData, isLoading:isLoadingTeam , isError:isErrorTeam } = useGetTeamsQuery();

  const [userdata , setUSerData ] = useState<{username:string; email:string; teamId:string , Role:string}>({
    username: "",
    email: "",
    teamId: "",
    Role: "Not-Defined",
   })

  const router = useRouter();
  //If data not fetched then it will redirect to error page
  useEffect(()=>{
    if(!userSettings && !isLoading && isError ) {
       dispatch(setError(true));
       dispatch(setMessage({error:"Failed To Load UserData Login Again"}));
       router.push("/login");
    };

    if(!TeamData && !isLoadingTeam && isErrorTeam ) {
      dispatch(setError(true));
      dispatch(setMessage({error:"Failed To Load UserData Login Again"}));
      router.push("/login");
    }
  },[userSettings , isLoading , isError , isErrorTeam , isLoadingTeam , TeamData]);
  
  useEffect(()=>{
   if(userSettings){
    setUSerData({
      username:userSettings.username || "",
      email: userSettings.email || "",
      teamId: userSettings.teamId?.toString() || "Not-Defined",
      Role: userSettings.Role?String(userSettings.Role) : "Not-Defined"
    })
   }
  },[userSettings])

  const labelStyles = "block text-sm font-medium dark:text-white";
  const textStyles = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white dark:focus:bg-slate-200  dark:focus:text-black";
  
  const handleInputChange = (e : React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>{
    console.log(e.target.value);
    setUSerData((prev)=> ({
    ...prev,
    [e.target.name]:e.target.value,
   }))
  }
  
  const HandleSaved = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try{
      const response = await updateUser( userdata ).unwrap();
      console.log(response.user)
      if(response.user){
        const {profilePictureUrl , userId ,teamId , Role , email , username } = response.user;
         setUSerData({teamId:teamId?.toString() || "Not-Defined" , Role:Role!.toString() , username ,email });
        }
      }
    catch (error){
     console.error("Failed to Update user:", error);
    }
  }
  return (
    <div className="p-8 ">
      <div className="flex justify-between relative">
      <Header name="Settings" />
      <button
      onClick={HandleSaved} 
      className="text-lg  py-1 px-5 p-1 bg-blue-600 rounded-md text-white font-semibold justify-center text-center absolute right-0 ">
        {isLoadingUserUpdate?<Loader size="10"/>:"Save"}
        {/* <Loader size="8"/> */}
      </button>
      </div>
      <div className="space-y-4">
{/* username */}
        <div>
        <label className={labelStyles}>Username</label>

        {!isedit.username ? (
          <div
            className={textStyles}
            onClick={() =>
              setIsEdit((prev) => ({
                ...prev,
                username: true
              }))
            }
          >
            {userdata?.username}
          </div>
        ) : (
          <input
            type="text"
            name="username"
            value={userdata?.username}
            className={textStyles}
            onChange={(e) => handleInputChange(e)}
            onBlur={(e) =>{
              setIsEdit((prev) => ({
                ...prev,
                username: false
              }));
              ()=>(!e.target.value &&(()=>{
                e.target.value ="Not-Defined",
                handleInputChange(e)  
              }));
              }
            }
            autoFocus
          />
          )}
        </div>

{/* Email */}
        <div>
          <label className={labelStyles}>Email</label>
          {
            !isedit.email?(
             <div onClick={(e)=> setIsEdit((prev)=> ({
              ...prev,
              email:true
             }))}
              className={textStyles}>{userdata?.email}</div>
            ):
            (
              <input type="text"
               className={`${textStyles} cursor-not-allowed focus:outline-red-600`}
              //  className="cursor-not-allowed" 
               name="email"
               value={userdata.email}
               readOnly
               autoFocus
               onBlur={()=>{
                setIsEdit(prev => (
                 {...prev , email:false} 
                ))
               }}
              />
            )
          }
        </div>
{/* TeamID */}
        <div>
          <label className={labelStyles}>Team</label>
          {
            !isedit.teamId ?(
             <div onClick={(e)=> setIsEdit((prev)=> ({
              ...prev,
              teamId:true
             }))}
              className={textStyles}>{userdata.teamId}</div>
            ):(<select
              className={textStyles} 
              name="teamId"
              autoFocus
              value={userdata.teamId}
              onChange={(e)=> handleInputChange(e)}
              onBlur={()=>{
               setIsEdit(prev => (
                {...prev , teamId:false} 
               ))
              }}>
              <option value={"Not-Defined"} key={"nothing"}>{"Not-Defined"}</option>
              {TeamData?.map((team)=><option value={`${team.teamId}`} key={`${team.teamId}${team.teamName}`}>{team.teamName}</option>)}
            </select>)
          }
        </div>
       {/*Role*/}
        <div>
          <label className={labelStyles}>Role</label>
          {
            !isedit.Role?(
             <div onClick={(e)=> setIsEdit((prev)=> ({
              ...prev,
              Role:true
             }))}
              className={textStyles}>{userdata?.Role}</div>
            ):
            (
              <select 
               className={textStyles} 
               name="Role"
               value={userdata.Role}
               onChange={(e)=> handleInputChange(e)}
               autoFocus
               onBlur={()=>{
                setIsEdit(prev => (
                 {...prev , Role:false} 
                ))
               }}
              >
             {roles.map(data =>(<option value={data} key={data}>{data}</option>))}
              </select>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Settings;