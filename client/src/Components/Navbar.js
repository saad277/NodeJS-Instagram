
import React from 'react'

import { Link ,useHistory} from 'react-router-dom'

import { connect } from 'react-redux'

import { clearUser } from '../Redux/userReducer/userActions'



const Navbar = (props) => {

 // console.log(props)

  let history=useHistory();

  const renderLinks = () => {


    if (props.user) {
      return [
        <li k={1}><Link to="/createPost">Create Post</Link></li>,
        <li k={1}><Link to="/subscribedPosts">Subscribed</Link></li>,
        <li k={2}><Link to="/profile">Profile</Link></li>,
        <li k={3}>
          <button
            className="btn waves-effect waves-light"
            onClick={() => {

              localStorage.clear()
              props.clearUser()
              history.push("/signIn")
            }}>
            Logout
          </button>
        </li>
      ]
    } else {

      return [

        <li k={4}><Link to="/signIn">SignIn</Link></li>,
        <li k={5}><Link to="/signUp">SignUp</Link></li>

      ]

    }
  }

  return (
    <nav >
      <div className="nav-wrapper white">
        <Link to={props.user ? "/" : "/signIn"} className="brand-logo left">Instagram</Link>
        <ul id="nav-mobile" className="right ">
          {renderLinks()}
        </ul>
      </div>
    </nav>
  )
}

const mapStateToProps = (state) => {

  return {

    user: state.user
  }

}

const dispatchStateToProps = (dispatch) => {

  return {

    clearUser: () => dispatch(clearUser())
  }

}

export default connect(mapStateToProps,dispatchStateToProps)(Navbar);