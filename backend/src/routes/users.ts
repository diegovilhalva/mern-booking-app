import  express, { Request,Response } from "express"
import User from "../models/user"
import jwt from "jsonwebtoken"
import {check, validationResult} from "express-validator"
const router = express.Router()

// create a user
router.post('/register',[
    check('firstName',"Este campo é obrigatório").isString(),
    check('lastName',"Este campo é obrigatório").isString(),
    check('email',"Este campo é obrigatório").isEmail(),
    check('password',"A senha precisa ter mais de 6 caratecteres").isLength({min:6})
    
],async (req:Request,res:Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({message:errors.array()})
    }
    try {
        let user = await User.findOne({
            email:req.body.email,

        })
        // check if the user exists
        if (user) {
            return res.status(400).json({message:"Usuário já existe"})
        }

        user = new User(req.body)
    
        await user.save()

        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET_KEY as string,{
            expiresIn:"10d"
        })
        res.cookie("auth_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            maxAge:864000000,
        })

        return res.status(200).json({message:"Usuário registrado"})
    } catch (error) {
        console.log(error)
        res.status(500).send({message:"Ocorreu um erro, tente novamente mais tarde"})
    }
})

export default router