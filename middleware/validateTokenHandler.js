const asyncHandler = require("express-async-handler")

const jwt = require("jsonwebtoken")

const validateAccessToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]

        //verifying the access token:

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
            if(error) {
                res.status(401)
                throw new Error("User is not Authorized");
            }
            // stores the decoded user, that is the user credentials stored in the jsonwebtoken into the req.user
            req.user = decoded.user;
            next();
        })

        if (!token) {
            req.status(401)
            throw new Error("User is not authorized")
        }
    }
})

module.exports = validateAccessToken