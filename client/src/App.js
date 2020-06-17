import React, { useEffect } from 'react';

import './App.css';

import Navbar from './Components/Navbar'
import Home from './Components/screens/Home'
import Profile from './Components/screens/Profile'
import SignIn from './Components/screens/SignIn'
import SignUp from './Components/screens/SignUp'
import CreatePost from './Components/screens/CreatePost'
import UserProfile from './Components/screens/UserProfile'
import SubscribedPosts from './Components/screens/SubscribedPosts'

import { Route, Switch, useHistory } from 'react-router-dom'

import { connect } from 'react-redux'

import { setUser } from './Redux/userReducer/userActions'

const Routing = () => {


  return (

    <Switch>

      <Route exact path="/" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/signUp" component={SignUp} />
      <Route path="/signIn" component={SignIn} />
      <Route path="/createPost" component={CreatePost} />
      <Route path="/userProfile/:id" component={UserProfile} />
      <Route path="/subscribedPosts" component={SubscribedPosts} />


    </Switch>

  )

}


const App = (props) => {


  //console.log(props)

  let history = useHistory();

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"))

    //console.log(user)

    props.setUser(user)

    if (user) {

      
    } else {

      history.push("/signIn")
    }

  }, [])



  return (
    <>
      <Navbar />

      <Routing />


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

    setUser: (user) => dispatch(setUser(user))


  }

}

export default connect(mapStateToProps, dispatchStateToProps)(App);
