const User = require('../models/users');
const Account = require('../models/accounts');
const jwt = require('jsonwebtoken');   
const bcrypt = require('bcrypt');      

require('dotenv').config();


const signUp = async (req,res) => {
    try {
        const user_email = req.body.email;
        const user_balance = req.body.balance;

        const user = await User.findOne({email: user_email});
        if(user){
            return res.status(400).json({msg: 'Email already exists! Please login or use a different email.'});
        }

        else{
            const user = new User(req.body);
            const savedUser = await user.save(user);

            const account = new Account({
                userId: savedUser._id,
                balance: user_balance
            });
            await account.save(account);

            const JWT_KEY = process.env.JWT_KEY;
            const token = jwt.sign({ id: user._id }, JWT_KEY, { expiresIn: '1h' });

            res.cookie('token', token, {httpOnly: true});

            return res.status(200).json({msg: 'Signed up successfully!'}); 
        }

    } catch (error) {
        return res.status(500).json({msg:error});
    }
}

const login = async (req,res) =>{
    try {
        const user_email = req.body.email?.trim();          
        const user_password = req.body.password?.trim();

        if(!user_email){
            return res.status(400).json({msg:'Email is required'});
        }
        else if(!user_password){
            return res.status(400).json({msg:'Password is required'});
        }
        
        const user = await User.findOne({email: user_email});

        if(!user){
            return res.status(404).json({msg: 'User does not exist. Please try signing up!'});
        }
        
        const isMatch = await bcrypt.compare(user_password, user.password);
        if(!isMatch){
            return res.status(500).json({msg: 'Wrong password!'});
        }

        const JWT_KEY = process.env.JWT_KEY;
        const token = jwt.sign({id: user._id}, JWT_KEY, {expiresIn: '1h'});

        res.cookie('token', token, {httpOnly: true});
        return res.status(200).json({ msg: 'Login successful' });  

        
    } catch (error) {
        return res.status(500).json({msg:error});
    }
};

const logOut = async (req,res)=>{
    res.clearCookie('token');
    return res.redirect('/login');
}




module.exports = {signUp, login,logOut};