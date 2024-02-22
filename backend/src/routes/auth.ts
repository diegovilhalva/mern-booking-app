import express, { Request, Response } from "express"
import {check, validationResult} from "express-validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user"
import verifyToken from "../middleware/auth"

const router = express.Router()

// user login

router.post('/login',[
    check('email','Digite o seu email').isEmail(),
    check('password','A senha precisa ter mais de 6 caratecteres').isLength({
        min:6,
    })
], async (req:Request,res:Response) => {
    const errors = validationResult(req)
    // check error on user's validation
    if(!errors.isEmpty()){
        return  res.status(400).json({message:errors.array()})
    }

    const {email,password} =  req.body

    try {
          // check if  user exists
        const user = await User.findOne({email})
     
        if (!user) {
            return res.status(400).json({message:"Não foi possível realizar sua solicitação"})
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if (!isMatch) {
            return res.status(400).json({message:"Usuário ou senha inválida"})
        }

        const token = jwt.sign({userid:user.id},process.env.JWT_SECRET_KEY as string,{
            expiresIn:'10d',
        }) 

        res.cookie('auth_token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            maxAge:864000000,
        })
        res.status(200).json({userId:user._id})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Ocorreu um erro! tente novamente mais tarde"})
    }
})

router.get('/validate-token',verifyToken,(req:Request,res:Response) => {
    res.status(200).send({userId:req.userId})
})

router.post('/logout',(req:Request,res:Response) => {
    res.cookie('auth_token',"",{
        expires:new Date(0)
    })
    res.send()
})

export default router