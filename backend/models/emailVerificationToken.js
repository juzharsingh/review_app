const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const emailVerificationTokenSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        expires: 3600,
        default: Date.now(),
    },
});

emailVerificationTokenSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedToken = await bcrypt.hash(this.token, salt)
        this.token = hashedToken
        next()
    } catch (error) {
        next(error)
    }
});

emailVerificationTokenSchema.methods.compareToken = async function(token) {
    const result = await bcrypt.compare(token, this.token)
    return result;
}

// userSchema.pre("save", async function (next) {
//     try {
//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(this.password, salt)
//         this.password = hashedPassword
//         next()
//     } catch (error) {
//         next(error)
//     }
// })

module.exports = mongoose.model("EmailVerificationToken", emailVerificationTokenSchema);