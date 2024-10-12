const mongoose = require('mongoose');
const bcrypt = require('bcrypt');      
const crypto = require('crypto');     

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'must provide name'],
        trim:true,
        maxlength: [20, 'name cannot be more than 20 characters']
    },
    email : {
        type : String,
        required : [true, 'must provide email'],
        unique : true,
        match : [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : [true, 'enter password']
    },
    resetPasswordToken : {
        type: String,
        default: undefined
    },
    resetPasswordExpires : {
        type: Date,
        default: undefined
    },
});


userSchema.pre('save', async function(next){
    const user = this;

   
    if(user.isModified('password')){
       
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    next();
});

userSchema.methods.generatePasswordReset = async function(){
    try {
        this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
        this.resetPasswordExpires = Date.now() + 3600000; 

    } catch (error) {
        console.log(error);
    }
}

userSchema.virtual('account', {
    ref: 'accounts',            
    localField: '_id',
    foreignField: 'userId',
    justOne: true              
});

userSchema.virtual('transactions',{
    ref: 'transactions',
    localField: '_id',
    foreignField: 'userId',
    justOne: false
});

module.exports = mongoose.model('users',userSchema);