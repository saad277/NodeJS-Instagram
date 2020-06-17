



export const setUser=(user)=>{


    return {

        type:"SET_USER",
        payload:user

    }

       
    

    
}

export const clearUser=()=>{

    return{

        type:"CLEAR_USER"
    }
}

export const updateUser=(user)=>{

    return{

        type:"UPDATE_USER",
        payload:user
    }
    
}

export const updatePic=(url)=>{

    return{

        type:"UPDATE_PIC",
        payload:url
    }
    
}