const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
});

// this is referring to the newUser in the controller/user
// we cant use arrow function here because we are using this keyword inside, so we will have to use simple function
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword; 
    }
    next();
});

userSchema.methods.comparePassword = async function(newPassword){
    const result = await bcrypt.compare(newPassword, this.password);
    return result;
}

module.exports = mongoose.model("User", userSchema);