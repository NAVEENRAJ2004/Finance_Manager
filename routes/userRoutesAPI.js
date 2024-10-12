const express = require('express');
const path = require('path');
const authenticateToken = require('../middlewares/authenticateToken');
const {
    login,
    logOut,
    signUp} = require('../controllers/users');

const {
    createTransaction,
    deleteTransaction,
    getAllTransactions} = require('../controllers/transactions');

const {
    resetPassword, 
    resetPasswordRequest} = require('../controllers/resetPass')


const router = express.Router();



router.route('/login').post(login);
router.route('/signup').post(signUp);
router.route('/logout').post(logOut);


router.route('/transactions').post(authenticateToken, createTransaction)
.get(authenticateToken, getAllTransactions)
.get(authenticateToken, (_,res)=>{
    res.sendFile(path.join(__dirname,'..', 'public/html' ,'transactions.html'));
});
router.route('/transactions/:id').delete(deleteTransaction);


router.route('/reset-password').post(resetPasswordRequest)
.get((_,res)=>{
    res.sendFile(path.join(__dirname, '..', 'public/html', 'resetPasswordRequest.html'));    
});

router.route('/reset/:token').post(resetPassword)
.get((req,res)=>{                                                                   
    res.render('resetPassword', {token: req.params.token});                        
});


module.exports = router;