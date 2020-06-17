import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { Link, useHistory } from 'react-router-dom'




const CreatePost = () => {

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    const history = useHistory()

    useEffect(() => {

        if (url) {


            fetch("/createPost", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({


                    title: title,
                    body: body,
                    pic: url
                })

            })
                .then((res) => res.json())
                .then(res => {
                    console.log(res)
                    if (res.error) {
                        M.toast({ html: res.error })
                    } else {

                        M.toast({ html: "Posted !! " })
                        history.push("/")
                    }
                }).catch((error) => console.log(error))

        }
    }, [url])


    const postDetails = () => {

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


    return (
        <div className="card input-field" style={{ margin: "10px auto", maxWidth: "500px", padding: "20px", textAlign: "center" }}>

            <input type="text"
                placeholder="title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />
            <input
                type="text"
                placeholder="body"
                onChange={(e) => setBody(e.target.value)}
                value={body}
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

            <button className="btn waves-effect waves-light blue" onClick={() => postDetails()}>
                Submit
                </button>


        </div>
    )

}


export default CreatePost;