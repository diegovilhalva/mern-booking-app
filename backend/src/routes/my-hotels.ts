import expresss, { Request, Response } from "express"
import multer from "multer"
import cloudinary from "cloudinary"
import Hotel from "../models/hotel"
import verifyToken from "../middleware/auth"
import { body } from "express-validator"
import  { hotelType } from "../shared/types"

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

            const imageUrls = await uploadImages(imageFiles)
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

router.get('/', verifyToken, async (req: Request, res: Response) => {

    try {
        const hotels = await Hotel.find({ userId: req.userId })
        res.json(hotels)
    } catch (error) {
        res.status(500).json({message:"Ocorreu um erro, tente novamente mais tarde"})
    }
})

router.get("/:id", verifyToken,async (req:Request,res:Response) => {
    const id = req.params.id.toString()
    try {
        const hotel = await Hotel.findOne({
            _id:id,
            userId:req.userId
        })
        res.json(hotel)
    } catch (error) {
        res.status(500).json({message:"Ocorreu um erro, tente novamente mais tarde"})
    }
})

router.put("/:hotelId",verifyToken,upload.array("imageFiles"),async (req:Request,res:Response) => {
    try {
        const updatedHotel: hotelType = req.body
        updatedHotel.lastUpdated = new Date()

        const hotel = await Hotel.findOneAndUpdate({
            _id:req.params.hotelId,
            userId:req.userId
        },updatedHotel,{new:true})

        if (!hotel) {
            return res.status(404).json({message:"Hotel não encontrado"})
        }
        const files = req.files as Express.Multer.File[]
        const updatedImageUrls = await uploadImages(files)

        hotel.imageUrls = [...updatedImageUrls,...(updatedHotel.imageUrls || []),]

        await hotel.save()
        res.status(201).json(hotel)

    } catch (error) {
        res.status(500).json({message:"Ocorreu um erro, tente novamente mais tarde"})
    }
})


async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64")
        let dataURI = "data:" + image.mimetype + ";base64," + b64
        const res = await cloudinary.v2.uploader.upload(dataURI)
        return res.url
    })

    const imageUrls = await Promise.all(uploadPromises)
    return imageUrls
}
export default router
