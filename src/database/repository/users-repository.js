const crypto = require("crypto");
const moment = require("moment");
const validator = require("validator");
const { User } = require("../models");
const { BadRequestError } = require("../../utils/app-errors");
const { signToken } = require("../../utils/auth");
const { JWT_EXPIRES_IN, BASE_URL } = require("../../config");
const { sendMailCompany } = require("../../utils");
const { RESPONSES } = require("../../utils/constants");


class UsersRepository
{
    async CreateUser(signUpInputs) 
    {
        const { firstName, lastName, email, phoneNumber, password, passwordConfirm } = signUpInputs;
        const user = new User({ firstName, lastName, email, phoneNumber, password, passwordConfirm });
        const userData = await user.save();

        userData.password = "";
        return {
            data: user,
            token: signToken(userData.id, JWT_EXPIRES_IN)
        };
    }


    async LoginUser(loginInputs) 
    {
        const { identifier, password } = loginInputs;
        const query = {};

        if (validator.isEmail(identifier)) query.email = identifier;
        if (validator.isMobilePhone(identifier)) query.phone = identifier;

        if (Object.keys(query).length === 0)
        {
            throw new BadRequestError("login identifier is missing")
        }

        const user = await User.findOne(query).select("+password");

        if (!user || !(await user.isCorrectPassword(password, user.password)))
        {
            throw new BadRequestError("Incorrect username or password")
        }

        user.password = "";

        return {
            data: user,
            token: signToken(user.id, JWT_EXPIRES_IN)
        }
    }


    async ForgotPassword(email) 
    {
        try
        {
            const user = await User.findOne({ email });

            if (!user) throw new BadRequestError("There is no account with this email");

            const resetToken = user.createPasswordResetToken();
            
            // to ignore passwordConfirm validation
            await user.save({ validateBeforeSave: false });
            
            const emailText = `Follow this link ${BASE_URL}/reset-password/${resetToken} to change your password`;
            await sendMailCompany(email, "Reset Password", emailText);
            const successMsg = "A link has been sent to your email with instructions to reset your password";

            return successMsg;
        }
        catch (error)
        {
            console.log(error.message);
            const errorMsg = error.message || "Request Failed";
            throw new BadRequestError(errorMsg);
        }
    }


    async ResetPassword(token, newPassword) 
    {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({ 
            passwordResetToken: hashedToken, 
            passwordResetExpired: { $gt: moment().unix() }
        });

        if (!user) throw new BadRequestError("Password reset token is invalid or has expired");

        user.password = newPassword;
        user.passwordConfirm = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpired = undefined;

        // run all validators
        await user.save();

        return { message: RESPONSES.SUCCESS }
    }


    async ChangePassword(newPassword, passwordConfirm) 
    {
        return { working: "yes" }
    }
}


module.exports = UsersRepository;