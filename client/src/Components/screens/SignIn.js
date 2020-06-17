import React ,{useState,useEffect}from 'react'
import { Link,useHistory } from 'react-router-dom'
import M from 'materialize-css'

import {connect} from 'react-redux'

import {setUser} from '../../Redux/userReducer/userActions'

const SignIn = (props) => {

    const history=useHistory();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    //console.log(props)
   
    const postData = () => {

        fetch("/signIn", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

               
                email: email,
                password: password
            })

        })
        .then((res)=>res.json())
        .then(res=>{
            console.log(res)
            if(res.error){
                M.toast({html:res.error})
            } else {

                localStorage.setItem("jwt",res.token)
                localStorage.setItem("user",JSON.stringify(res.user))
                 
                props.setUser(res.user)

                M.toast({html:"logged id"})
                history.push("/")
            }
        }).catch((error)=>console.log(error))

    }

    return (
        <div className="my-card">
            <div className="card auth-card ">
                <h2>Instagram</h2>
                <input type="text" placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input type="password" placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button className="btn waves-effect waves-light" onClick={()=>postData()}>
                    Login
                </button>

                <h5>
                    <Link to="/signUp">Dont have an account ? </Link>
                </h5>



            </div>
        </div>
    )
}



const dispatchStateToProps=(dispatch)=>{

return {

    setUser:(user)=>dispatch(setUser(user))


}

}

export default connect(null,dispatchStateToProps)(SignIn);