// auth, isStudent, isAdmin middlewares

const jwt = require("jsonwebtoken");
require("dotenv").config();

// auth middleware -> follow the syntaxes
exports.auth = (req, res, next) => {
    try{
        // extract jwt token
        // most secure => header Authorization
        // format of the header is => Authorization Bearer <token>
        console.log("Cookie ", req.cookies.token);
        console.log("Body ", req.body.token);
        console.log("Header ", req.header("Authorization"));
        const token = req.cookies.token|| req.body.token  || req.header("Authorization").replace("Bearer ", "");

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Please login first",
            });
        }
        // verify token
        try{
            // decode the token(or payload)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // attach user to request object
            req.user = decoded;
            // next(); // call next middleware
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "Invalid Token",
            });
        }
        next(); // call next middleware
    } 
    catch(err){
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success: false,
                message: "Access Denied, You are not a student",
            });
        }
        next(); // call next middleware
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User role is not matched",
        });
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "Access Denied, You are not an admin",
            });
        }
        next(); // call next middleware
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "User role is not matched",
        });
    }
}
