import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    } catch (error) {
        console.log(error)
    }
})

userSchema.methods.comparePassword = async function(enteredPassword){
    try {
        return await bcrypt.compare(enteredPassword, this.password)
    } catch (error) {
        console.log(error)
    }
}

userSchema.methods.generateToken = async function (){
    try{
        return await jwt.sign({
            id: this._id,
            name: this.name,
            email: this.email,
            token: this.token
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    )

    }catch(error){
        console.log(error)
    }
}


const User = mongoose.model("User", userSchema)

export default User