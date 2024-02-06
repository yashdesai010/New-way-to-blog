import { createContext, useState } from "react";
export const Usercontext=createContext({})

export function Usercontextprovider({children}){
    const[userInfo,setUserinfo]=useState({});
return(
    <Usercontext.Provider value={{userInfo,setUserinfo}}>
        {children}
    </Usercontext.Provider>
);


}