import React, { useEffect, useState } from 'react'

import { connect } from 'react-redux'

import { updatePic } from '../../Redux/userReducer/userActions'



const Profile = (props) => {

    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    //console.log(props)

    useEffect(() => {



        fetch("/myPosts", {

            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }

        })
            .then(res => res.json())
            .then((result) => {

                // console.log(result.myPosts)
                setPosts(result.myPosts)

            })

    }, [])

    useEffect(() => {

        if (image) {


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
                  
                  
                    // console.log(data.url)
                    setUrl(data.url)

            
                    fetch("/updatePic",{

                        method:"PUT",
                        headers:{
                            "Content-Type":"application/json",
                            "Authorization":"Bearer "+localStorage.getItem("jwt")

                        },
                        body:JSON.stringify({
                            pic:data.url
                        })
                    
                    }).then((res)=>res.json())
                    .then((result)=>{

                        console.log("............ad")

                        console.log(result)
                        
                        
                        localStorage.setItem("user", JSON.stringify({
                            ...props.user,
                            pic: result.pic
                        }))
    
                        props.updatePic(result.pic)

                    }).catch((error) => console.log(error))

                })
                .catch((error) => console.log(error))

        }


    }, [image])



    const updatePhoto = (file) => {

        setImage(file)



    }


    return (
        <div style={{ maxWidth: "750px", margin: "0px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                <div >
                    <img
                        src={props.user ? props.user.pic : "https://i.pinimg.com/originals/10/b2/f6/10b2f6d95195994fca386842dae53bb2.png"}
                        style={{ width: "160px", height: "160px", borderRadius: "80px" }}></img>

                    <div style={{ marginLeft: 16, marginTop: 10, }}>
                        <div className="file-field input-field">
                            <div className="btn blue">
                                <span >Upload Image</span>
                                <input type="file"
                                    onChange={(event) => updatePhoto(event.target.files[0])}

                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" />
                            </div>
                        </div>
                    </div>

                </div>


                <div>
                    <h4>{props.user ? props.user.name : "Loading.."}</h4>
                    <h5>{props.user ? props.user.email : "Loading.."}</h5>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                        <h6>40 posts</h6>
                        <h6>{props.user ? props.user.followers.length : "0"} followers</h6>
                        <h6>{props.user ? props.user.following.length : "0"} following</h6>
                    </div>
                </div>
            </div>

            <div className="gallery">

                {posts.map((x, key) => {

                    return (

                        <img className="item" src={x.photo} key={key} ></img>
                    )
                })}


            </div>
        </div>

    )
}


const mapStateToProps = (state) => {

    return {

        user: state.user
    }

}


const dispatchStateToProps = (dispatch) => {

    return {

        updatePic: (url) => dispatch(updatePic(url))
    }

}

export default connect(mapStateToProps, dispatchStateToProps)(Profile);