// we need express, Router and controller
const express = require('express');
const router = express.Router();


const {login,signup} = require('../Controllers/Auth');
const {auth, isStudent, isAdmin} = require('../middlewares/auth');

router.post("/signup",signup);
router.post("/login",login);

// protected route for testing purpose
router.get("/test",auth, (req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the test route",
    })
})
// protected routes
router.get("/student",auth,isStudent, (req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the protected route for Students",
    })
})
router.get("/admin",auth,isAdmin, (req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the protected route for Admins",
    })
})
// dont forget to export it
module.exports = router;