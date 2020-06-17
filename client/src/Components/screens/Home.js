import React, { useState, useEffect } from 'react'

import { connect } from 'react-redux'

import { Link } from 'react-router-dom'

const Home = (props) => {


    const [data, setData] = useState([])

    useEffect(() => {

        fetch("/allPosts", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }

        })
            .then((res) => res.json())
            .then((data) => {

                // console.log(data.posts)
                console.log(data)
                setData(data.posts)

            })

    }, [])



    const likePost = (id) => {

        fetch("/like", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({

                postId: id
            })

        }).then((res) => res.json())
            .then((result) => {

                const newData = data.map((data) => {

                    if (data._id === result._id) {

                        return result;
                    } else {

                        return data;
                    }
                })

                setData(newData)

            }).catch((error) => console.log(error))


    }



    const unLikePost = (id) => {

        fetch("/unLike", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({

                postId: id
            })

        }).then((res) => res.json())
            .then((result) => {

                const newData = data.map((data) => {

                    if (data._id === result._id) {

                        return result;
                    } else {

                        return data;
                    }
                })

                setData(newData)

            }).catch((error) => console.log(error))


    }

    let id = null;

    if (props.user) {

        id = props.user._id
    }
    else {

        id = null
    }


    const makeComment = (text, postId) => {

        fetch("/comment", {
            method: "PUT",
            headers: {

                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({

                text: text,
                postId: postId

            })


        }).then((res) => res.json())
            .then((result) => {

                console.log(result)

                const newData = data.map((data) => {

                    if (data._id === result._id) {

                        return result;
                    } else {

                        return data;
                    }
                })

                setData(newData)


            })
    }


    const deletePost = (postId) => {




        fetch("/deletePost/" + postId, {

            method: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }

        }).then((res) => res.json())
            .then((result) => {

                console.log("result----")
                let id = result.result._id

                const newData = data.filter(item => {
                    return item._id !== id
                })


                setData(newData)


            })

    }

    return (
        <div className="home">

            {
                data.map((x, key) => {

                    return (

                        <div className="card home-card" key={key}>

                            <h5 style={{padding:10}}><Link to={x.postedBy._id === id ? `/profile` : `/userProfile/${x.postedBy._id}`}>

                                {x.postedBy["name"]}

                            </Link>

                                {x.postedBy._id === id &&
                                    <i className="material-icons"
                                        onClick={() => deletePost(x._id)}
                                        style={{ float: "right" }}>delete</i>}

                            </h5>
                            <div className="card-image">
                                <img src={x.photo}></img>
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>

                                {x.likes.includes(id) ?
                                    <i className="material-icons" onClick={() => unLikePost(x._id)}>thumb_down</i>
                                    : <i className="material-icons" onClick={() => likePost(x._id)}>thumb_up</i>}




                                <h6>{x.likes.length} likes</h6>
                                <h6>{x.title}</h6>
                                <p>{x.body} </p>
                                {x.comments.map((comment) => {

                                    return (
                                        <h6 key={comment._id}>  <span style={{ textDecoration: "bold" }}>  {comment.commentedBy.name}  </span>{comment.text}</h6>
                                    )
                                })}
                                <form onSubmit={(e) => {
                                    e.preventDefault();

                                    makeComment(e.target[0].value, x._id)
                                }} >
                                    <input type="text" placeholder="add a comment" />
                                </form>

                            </div>
                        </div>

                    )


                })
            }


        </div>
    )
}


const mapStateToProps = (state) => {

    return {

        user: state.user
    }

}

export default connect(mapStateToProps)(Home);