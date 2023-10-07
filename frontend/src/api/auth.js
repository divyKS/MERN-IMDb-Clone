import client from "./client";

export const createUser = async (userInfo) => {
    try {
        const {data} = await client.post('/user/create', userInfo)
        // our data looks like
        //     { 
        //          user: {
        //          id: newUser._id,
        //          name: newUser.name,
        //          email: newUser.email
        //          }
        //      }
        return data
    } catch (error) {
        // if we send back error responses like 400, 500 ... react will take it as an error
        // console.log(error.response)
        if(error.response?.data) return error.response.data
        return {"error": error.message || error}
    }
}

export const verifyUserEMail = async (userInfo) => {
    try {
        console.log("auth:", userInfo);
        const {data} = await client.post('/user/verify-email', userInfo)
        return data
    } catch (error) {
        console.log(error.response?.data)
        if(error.response?.data) return error.response.data
        return {"error": error.message || error}
    }
}

export const signInUser = async(userInfo)=>{
    try {
        const {data} = await client.post('/user/signin', userInfo)
        return data
    } catch (error) {
        console.log(error.response?.data)
        if(error.response?.data) return error.response.data
        return {"error": error.message || error}
    }
}

export const getIsAuth = async(token)=>{
    try {
        const {data} = await client.get('/user/is-auth', {
            headers: {
                "Authorization": 'Bearer ' + token ,
                accept: "application/json"
            }
        })
        return data
    } catch (error) {
        console.log(error.response?.data)
        if(error.response?.data) return error.response.data
        return {"error": error.message || error}
    }
}

export const forgotPassword = async(email)=>{
    try {
        const {data} = await client.post('/user/forgot-password', {"email": email})
        return data
    } catch (error) {
        console.log(error.response?.data)
        if(error.response?.data) return error.response.data
        return {"error": error.message || error}
    }
}

export const verifyPasswordResetToken = async (token, userId)=>{
    try{
        const {data} = await client.post('/user/verify-reset-pass-token', {
            "token": token,
            "userId": userId
        })
        return data
    } catch (error){
        console.log(error.response?.data)
        if(error.response?.data) return error.response.data
        return {"error": error.message || error}
    }
}

export const resetPassword = async(passwordInfo)=>{
    try {
        const {data} = await client.post('/user/reset-password', passwordInfo)
        return data
    } catch (error) {
        console.log(error.response?.data)
        if(error.response?.data) return error.response.data
        return {"error": error.message || error}
    }
}

export const resendEmailVerificationToken = async(userId)=>{
    try{
        const {data} = await client.post('/user/resend-email-verification-token', {userId})
        return data
    } catch (error) {
        console.log(error.response?.data)
        if(error.response?.data) return error.response.data
        return {"error": error.message || error}
    }
}