const iState=null


    



const userReducer=(state=iState,action)=>{


    //console.log(action)


    if(action.type=="SET_USER"){
        
        return action.payload 
    }

    if(action.type=="CLEAR_USER"){
        
        return null 
    }

    if(action.type=="UPDATE_USER"){

        return action.payload
    }

    if(action.type=="UPDATE_PIC"){
        
        return {

            ...state,
            pic:action.payload
        }
    }

    return state


}

export default userReducer;