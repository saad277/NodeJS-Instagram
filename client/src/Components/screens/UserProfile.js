import React, { useEffect, useState } from 'react'

import { connect } from 'react-redux'

import { useParams } from 'react-router-dom'



import { updateUser } from '../../Redux/userReducer/userActions'


const UserProfile = (props) => {

    const [profile, setProfile] = useState(null)




    // console.log(props)

    const { id } = useParams()

    //console.log(id)

    const [showFollow, setFollow] = useState(true)

    useEffect(() => {



        fetch("/user/" + id, {

            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }

        }).then(res => res.json())
            .then((result) => {

                console.log(result)



                setProfile(result)

                //console.log(profile)
                // props.user?!props.user.followers.includes(id):true    

              //  setFollow(props.user ? props.user.following.includes(id) : false)







            })

    }, [])



    const followUser = () => {

        fetch("/follow", {

            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({

                followId: id
            })

        }).then((res) => res.json())
            .then((data) => {

                props.updateUser(data)
                console.log(data)

                localStorage.setItem("user", JSON.stringify(data))

                setProfile((prevState) => {

                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })

            })
       // setFollow(false)

    }


    const unFollowUser = () => {

        fetch("/unFollow", {

            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({

                unFollowId: id
            })

        }).then((res) => res.json())
            .then((data) => {

                props.updateUser(data)
                console.log(data)

                localStorage.setItem("user", JSON.stringify(data))

                setProfile((prevState) => {

                    const newFollowers = prevState.user.followers.filter((item) => {

                        return item != data._id
                    })

                    return {

                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollowers
                        }

                    }
                })

            })

       // setFollow(true)

    }

    return (

        <>

            {profile ?

                <div style={{ maxWidth: "750px", margin: "0px auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-around", margin: "18px 0px", borderBottom: "1px solid grey" }}>
                        <div >
                            <img
                                src={profile.user.pic}
                                style={{ width: "160px", height: "160px", borderRadius: "80px" }}></img>
                        </div>
                        <div>
                            <h4>{profile.user.name}</h4>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{profile.post.length} Posts</h6>
                                <h6>{profile.user.followers.length} Followers</h6>
                                <h6>{profile.user.following.length} Following</h6>

                                {props.user.following.includes(id) ?
                                    <button className="btn waves-effect waves-light" onClick={() => unFollowUser()}>
                                        UnFollow
                                </button> :

                                    <button className="btn waves-effect waves-light" onClick={() => followUser()}>
                                        Follow
                                </button>}






                            </div>
                        </div>
                    </div>

                    <div className="gallery">

                        {profile.post.map((x, key) => {

                            return (

                                <img className="item" src={x.photo} key={key} ></img>
                            )
                        })}


                    </div>
                </div> : <h2>Loading...</h2>



            }

        </>

    )


}


const mapStateToProps = (state) => {

    return {

        user: state.user
    }

}

const dispatchStateToProps = (dispatch) => {


    return {

        updateUser: (user) => dispatch(updateUser(user))
    }

}

export default connect(mapStateToProps, dispatchStateToProps)(UserProfile);