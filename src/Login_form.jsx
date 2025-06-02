import { useState } from "react"
import { toast } from 'react-toastify';
import Login from "./Login";
import SignUp from "./SignUp";

function Login_form(){
    const [islogin,setISLogin]=useState(true)
    return( <>
            <div>
            <div className="absolute top-1 right-1">
                <button className={islogin ? 'Active':''} onClick={()=>setISLogin(true)} >Login</button>
                <button className={islogin ? '' : 'Active'} onClick={()=>setISLogin(false)} >SignUp</button>
            </div>
            <div>
                {islogin ?
                <div>
                <Login/>
                </div>
                : <div>
                <SignUp/>
                </div>}
            </div>
        </div>
        </>
         
    )
}
export default Login_form