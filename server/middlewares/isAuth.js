import jwt from "jsonwebtoken"

// Accepts the token from the Authorization header (Safari, iPhone) or from the cookie (other browsers)
const isAuth = (req, res, next) => {
    const header = req.headers.authorization || ""
    const headerToken = header.startsWith("Bearer ") ? header.slice(7).trim() : ""
    const tokens = [headerToken, req.cookies?.token].filter(Boolean)

    if (tokens.length === 0) {
        return res.status(401).json({ message: "user does not have a token" })
    }

    for (const token of tokens) {
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = verified.userId
            return next()
        } catch (error) {
            // this one was invalid or expired, try the next one
        }
    }

    return res.status(401).json({ message: "user does not have a valid token" })
}

export default isAuth
