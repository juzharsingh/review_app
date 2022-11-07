const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

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
        type: String
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    }
})


// userSchema.pre("save", async function (next) {
//     if (this.isModified("password")) {
//         this.password = await bcrypt.hash(this.password, 10);
//     }

//     next();
// });

// above was the orginal video from the course, but it was not working so I redo it with the help of
// this video https://www.youtube.com/watch?v=rYdhfm4m7yg

userSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
});

userSchema.methods.comparePassword = async function(password) {
    const result = await bcrypt.compare(password, this.password)
    return result;
}


module.exports = mongoose.model("User", userSchema);