import { createContext, useEffect, useState } from "react";


const AuthContext = createContext({});

export const AuthContextProvider = (children:any)=>{
    const [auth,setAuth] = useState({user:null,token:null})

    useEffect(()=>{
        const user = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        if(user){
            setAuth({...auth,user:JSON.parse(user)})
        }
        if(token){
            setAuth({...auth,token:JSON.parse(token)},)
        }
    },[])
    return <AuthContext.Provider value={{auth}}>
        {children}
    </AuthContext.Provider>

}

export default AuthContext