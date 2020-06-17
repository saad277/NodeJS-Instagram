import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'



const SignUp = (props) => {

    const history = useHistory();

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")


    useEffect(()=>{

        if(url){
            uploadFields()
        }

    },[url])


    const uploadImage = () => {



        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "insta-clone")
        data.append("cloud_name", "saad277")
        fetch("https://api.cloudinary.com/v1_1/saad277/image/upload", {
            method: "POST",
            body: data
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setUrl(data.url)
            })
            .catch((error) => console.log(error))
    }


    const uploadFields = () => {

        fetch("/signUp", {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                name: name,
                email: email,
                password: password,
                pic:url
            })

        })
            .then((res) => res.json())
            .then(res => {
                console.log(res)


               


                if (res.error) {
                    M.toast({ html: res.error })
                } else {

                    M.toast({ html: res.message })
                    history.push("/")
                }
            }).catch((error) => console.log(error))


    }



    const postData = () => {

        if(image){

            uploadImage()
        
        } else {

            uploadFields()
        }


    }


    return (
        <div className="my-card">
            <div className="card auth-card ">
                <h2>Instagram</h2>

                <input type="text" placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                <input type="text" placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input type="password" placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn blue">
                        <span >Upload Image</span>
                        <input type="file"
                            onChange={(event) => setImage(event.target.files[0])}

                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <button className="btn waves-effect waves-light"
                    onClick={() => postData()}
                >
                    SignUp
                </button>

                <h5>
                    <Link to="/signIn">Already have an account ? </Link>
                </h5>


            </div>
        </div>
    )
}



    


export default SignUp;