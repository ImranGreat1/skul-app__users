const UserService = require("../services/users-services");
const { protect } = require("./middleware");


const users = (app) => 
{
    const service = new UserService();

    app.post("/signup", async (req, res, next) => 
    {
        try 
        {
            const { firstName, lastName, email, phoneNumber, password, passwordConfirm }  = req.body;
            const userData = { firstName, lastName, email, phoneNumber, password, passwordConfirm };

            const { data } = await service.SignUp(userData);   
            return res.json(data);
        } 
        catch (error) 
        {
            console.log(error.message);
            next(error);
        }
    })


    app.post("/login", async (req, res, next) => 
    {
        try 
        {
            const { identifier, password } = req.body;

            const { data } = await service.Login({ identifier, password });
            return res.json(data);
        } 
        catch (error) 
        {
            console.log(error.message);
            next(error);
        }
        
    })


    app.post("/forgot-password", async (req, res, next) => 
    {
        try
        {
            const { data } = await service.ForgotPassword(req.body.email); 
            return res.json(data);
        }
        catch (error)
        {
            console.log(error.message);
            next(error);
        }
    })


    app.post("/reset-password/:token", async (req, res, next) => 
    {
        try 
        {
            const { data } = await service.ResetPassword(req.params.token, req.body.password, req.body.passwordConfirm);
            return res.json(data);
        } 
        catch (error) 
        {
            console.log(error.message);
            next(error);
        }
    });


    app.post("/change-password", protect, async (req, res, next) => 
    {
        try 
        {
            const { data } = await service.ChangePassword(req.body.password, req.body.passwordConfirm);
            return res.json(data);

        } catch (error) 
        {
            console.log(error.message);
            next(error);
        }
    });


    app.post("/create-profile", async (req, res, next) => 
    {
        try 
        {
            
        } 
        catch (error) 
        {
            console.log(error.message);
            next(error);
        }
    })


    app.get("/protected", protect, (req, res, next) => 
    {
        console.log(res.locals.user);
        res.json({ message: "Access Granted" });
    })
}


module.exports = users;
