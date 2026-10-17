import genToken from "../config/token.js"
import User from "../models/user.model.js"

// Used for login AND logout, so both match
const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

export const googleAuth = async (req,res) => {
    try {
        const {name , email} = req.body
        let user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name ,
                email
            })
        }
        let token = await genToken(user._id)
        res.cookie("token" , token , cookieOptions)

        // The token is also sent in the reply, for Safari and iPhone (they block the cookie)
        return res.status(200).json({ ...user.toObject(), token })

    } catch (error) {
        return res.status(500).json({message:`Google auth error ${error}`})
    }
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" })
        return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
         return res.status(500).json({message:`Logout error ${error}`})
    }
}
