const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const moment = require("moment");
const { getNow, emailValidate, phoneValidate, schemaOptions } = require("../../utils");


const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'A user must provide first name'],
        },
        lastName: {
            type: String,
            required: [true, 'A user must provide last name'],
        },
        middleName: String,
        email: {
            type: String,
            required: [true, 'A user must provide an email'],
            unique: [true, "An account already exist with this email"],
            validate: emailValidate,
        },
        photo: String,
        phoneNumber: {
            type: String,
            validate: phoneValidate,
        },
        userType: {
            type: String,
            required:true,
            enum: ["student", "staff", "hybrid"]
        },
        password: {
            type: String,
            required: [true, 'A user must provide a password'],
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'A user password must be confirmed'],
        },
        permissions: {
            type: [String],
        },
        studentProfile: {
            type: Schema.Types.ObjectId,
            ref: 'StudentProfile',
        },
        staffProfile: {
            type: Schema.Types.ObjectId,
            ref: 'StaffProfile',
        },
        active: {
            type: Boolean,
            default: true,
        },
        suspended: {
            type: Boolean,
            default: false,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        passwordResetToken: String,
        passwordChangedAt: Date,
        passwordResetExpired: Number,
        dateRegistered: {
            type: Date,
            required: [true, 'A user must have registered date'],
            default: getNow,
        }
    },
    schemaOptions
);

// Hash password before saving to DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    /* Set it by back-timing it by 1s because sometimes the token is issued before 
    the document is saved */
    this.passwordChangedAt = moment().unix() - 1;
    next();
});

userSchema.pre('save', function (next) {
    if (!this.email && !this.phoneNumber) {
        return next(
            new Error('Provide either email or phone number for authentication')
        );
    }

    next();
});

// Filter out non active users
userSchema.pre('find', function (next) {
    this.find({ active: { $eq: true } });
    next();
});

// SCHEMA METHODS

userSchema.methods.isCorrectPassword = async function (
    requestPassword,
    encryptedPassword
) {
    const isCorrect = await bcrypt.compare(requestPassword, encryptedPassword);
    return isCorrect;
};

// checks if user has changed password after auth token has been issued
userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        return JWTTimeStamp < this.passwordChangedAt;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    // send unhashed token to user
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // token expires after 10 min
    this.passwordResetExpired = moment().unix() + 10 * 60;

    return resetToken;
};

const User = model('User', userSchema);


module.exports = User;