// install bcrypt
// then import it
const bcrypt = require('bcrypt');
// import model
const User = require('../Models/User');
// jwt
const jwt = require('jsonwebtoken');


// sign up route handler
exports.signup = async(req,res)=>{
    try{
        // fetch the data from model's req body
        const {name,password,role,email} = req.body;
        // check user already exits ot not using unique id email
        // always use await whenever db interacts
        const isExistingUser = await User.findOne({email});
        if(isExistingUser){
            return res.status(400).json({
                success:failed,
                message:"User already Exist",
            })
            }
        // new user
        // seecure it's password using hashing
        let hashedpw;
        try{
            hashedpw = await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:failed,
                message:"Error in hashing password "
            })
        }
        // store in the db or create user in the db entry
        // again db interaction so use await
        let user = await User.create({
            name,email,password:hashedpw,role
        });
        return res.status(200).json({
            success : true,
            message : "User Created Successfully",
            data : user
        });
    }
    catch(err){
         console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be register,Please try again later",
        })
    }
}

// login
exports.login = async(req,res)=>{
    try{
        // data fetch
        const {email,password} = req.body;
        // validation on email and pw
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }
        // check user exists or not
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered,Please signup first",
            });
        }
        const payload = {
            email:user.email,
            role:user.role,
            id:user._id,
        }
        // check password is correct or not 
        if(!await bcrypt.compare(password,user.password)){
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials",
            });
        }else{
            // password matched
            // create a token
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn: "2h", // token will expire in 1 hour
            })
            // user = user.toObject();
            // user.token = token; // add token to user object
            // user.password = undefined; // remove password from user object not the database
            user = user.toObject();
            user.token = token;
            user.password = undefined;
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // cookie will expire in 3 days
                httpOnly: true, // cookie is not accessible via client side script
            }
            res.cookie("token",token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully",   
            });
        }
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be login,Please try again later",
        })
    }
}