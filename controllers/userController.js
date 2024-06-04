const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// @desc Register a user
// @route POST /api/users/register
// @access private
const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body;
    if (!username, !email, !password) {
        res.status(400)
        throw new Error("All the fields are mandatory")
    }

    // Hash Password: the hash method takes 2 input parameters, the original password and the number of rounds of hashing

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password: " + hashedPassword)

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
    })

    console.log(`User created: ${newUser}`);

    if(newUser) {
        res.status(200).json({ _id: newUser.id, email: newUser.email })
    }
    else {
        res.status(400)
        throw new Error("User data is not valid")
    }

})


// @desc Login a user
// @route POST /api/users/login
// @access private
const loginUser = asyncHandler(async (req, res) => {
    // take email and password from req and check if it is present or not:

    const {email, password} = req.body;

    if(!email || !password) {
        res.status(400)
        throw new Error("All fields are necessary")
    }

    // finding user in database

    const user = await User.findOne({email})

    // comparing password with hashed password: 
    // user.password is the hashed password from the database and password is the password entered by user and we got it from the req.body

    if(user && await bcrypt.compare(password, user.password)) {
        // provide access token for the user for completing the login
        accessToken = jwt.sign({
            // payload, has all the data which we want to embed in the access token
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            }
        }, 
        // access token secret:
        process.env.ACCESS_TOKEN_SECRET,

        // expiry time:
        {expiresIn: "15m"}
    
    ),
        res.status(200).json({accessToken});
    } 
    else{
        res.status(401)
        throw new Error("User credentials are incorrect")
    }

})



// @desc Current User Info
// @route POST /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
    res.json(req.user)
})




module.exports = { registerUser, loginUser, currentUser }