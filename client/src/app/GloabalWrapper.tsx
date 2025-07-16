import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "./redux";
import { setError } from "@/state";

const GloabalWrapper =  ({children}:{children : React.ReactNode})  => {
const dispatch = useDispatch();

const {Error , isError} = useAppSelector((state) => state.global);
  return (
    <>
        {Error && (
          <div className={`
           bg-red-500 text-white px-4 py-2 rounded shadow-lg z-1000 h-10
             font-semibold flex justify-center items-center bottom-[20%] fixed top-5 duration-500 ease-in-out ${isError ? "opacit-100 right-5":"opacity-0 -right-40"}`}>
             {Error?Error:"Something Went Wrong"}
           <button
           onClick={(e) => {
            e.preventDefault();
            dispatch(setError(false))
           }} 
           className="font-bold ml-4">X</button>
        </div>
      )}
      {}
    {children}
    </>
  )
}
export default GloabalWrapper