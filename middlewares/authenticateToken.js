const jwt = require('jsonwebtoken');
const User = require('../models/users');
require('dotenv').config();

const authenticateToken = async (req,res,next) =>{
    try {
      
        const token = req.cookies.token || req.header('Authentication')?.replace('Bearer ', ''); 
        if(!token){
            return res.redirect('/login');
        }

        const JWT_KEY = process.env.JWT_KEY;
        const decoded = jwt.verify(token, JWT_KEY);
        const user = await User.findById(decoded.id).populate('account');
        
        if(!user) return res.redirect('/login');
            
        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication error:", error);
        return res.redirect('/login');
    }
    
    
};

module.exports = authenticateToken;