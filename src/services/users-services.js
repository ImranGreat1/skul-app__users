const { UsersRepository } = require("../database");
const { formatData } = require("../utils");
const { BadRequestError } = require("../utils/app-errors");


class UserService 
{

    constructor() 
    {
        this.repository = new UsersRepository()
    }

    
    async SignUp(userInputs) 
    {
        const { firstName, lastName, email, password, passwordConfirm } = userInputs;
        const user = await this.repository.CreateUser({ firstName, lastName, email, password, passwordConfirm });
        
        return formatData(user);
    }


    async Login (loginInputs)
    {
        const { identifier, password } = loginInputs;
        const user = await this.repository.LoginUser({ identifier, password });

        return formatData(user);
    }


    async ForgotPassword (email) 
    {
        const emailData = await this.repository.ForgotPassword(email);

        return formatData(emailData);
    }


    async ChangePassword (password, passwordConfirm) 
    {
        if (password !== passwordConfirm) throw new BadRequestError("Passwords did not match");

        const response = await this.repository.ChangePassword(password, passwordConfirm);
        return formatData(response);
    }


    async ResetPassword (token, password, passwordConfirm) 
    {
        if (password !== passwordConfirm) throw new BadRequestError("Passwords did not match");
        
        const response = await this.repository.ResetPassword(token, password);
        return formatData(response);
    }
    
}


module.exports = UserService;