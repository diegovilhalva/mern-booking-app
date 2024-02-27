import expresss, { Request, Response } from "express"
import multer from "multer"
import cloudinary from "cloudinary"
import Hotel, { hotelType } from "../models/hotel"
import verifyToken from "../middleware/auth"
import { body } from "express-validator"

const router = expresss.Router()

const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

router.post('/', verifyToken, [
    body("name").notEmpty().withMessage("Este campo é obrigatório"),
    body("city").notEmpty().withMessage("Este campo é obrigatório"),
    body("country").notEmpty().withMessage("Este campo é obrigatório"),
    body("description").notEmpty().withMessage("Este campo é obrigatório"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Este campo é obrigatório e precisa ser um número"),
    body("facilities").notEmpty().isArray().withMessage("Este campo é obrigatório"),
], upload.array('imageFiles', 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: hotelType = req.body;

            // upload images to cloudinary

            const uploadPromises = imageFiles.map(async (image) => {
                const b64 = Buffer.from(image.buffer).toString("base64")
                let dataURI = "data:" + image.mimetype + ";base64," + b64
                const res = await cloudinary.v2.uploader.upload(dataURI)
                return res.url;
            })

            const imageUrls = await Promise.all(uploadPromises)
            // if upload was successful, add the URLs to the new hotel
            newHotel.imageUrls = imageUrls
            newHotel.lastUpdated = new Date()
            newHotel.userId = req.userId


            // save the new hotel to the database

            const hotel = new Hotel(newHotel)
            await hotel.save()

            res.status(201).send(hotel)
        } catch (e) {
            console.log("Erro ao criar hotel:", e)

            res.status(500).json({ message: "Ocorreu um erro, tente novamente mais tarde!" })
        }
    })

export default router