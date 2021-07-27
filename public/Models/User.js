"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
//creating schema for users
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        validate: [validator_1.default.isEmail, "kindly enter a valid email"],
    },
    passwordChangedAt: Date,
    photo: String,
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [8, "password must be at least 8 charachters"],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "kindly confirm your password"],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: "passwords mismatch",
        },
    },
    role: {
        type: String,
        enum: ["user", "guide", "lead-guide", "admin"],
        default: "user",
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
});
//encrypt user password before saving it to DB
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt_1.default.hash(this.password, 12);
    //deleting confirmPassword field
    this.confirmPassword = undefined;
    next();
});
//check if user login password matches the the saved one
userSchema.methods.correctPassword = async (enteredPassword, userPassword) => {
    return await bcrypt_1.default.compare(enteredPassword, userPassword);
};
//compare jwt issuance time with last time of password change
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
        return changedTimeStamp > jwtTimeStamp;
    }
    return false;
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = (Date.now() +
        10 * 60 * 1000);
    return resetToken;
};
//change passwordChangedAt property if user reset his password or for new user
userSchema.pre('save', function (next) {
    if (this.isModified(this.password) || this.isNew) {
        this.passwordChangedAt = Date.now() - 1000;
    }
    next();
});
//hide deactivated users from selections
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map