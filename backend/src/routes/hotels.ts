import express, { Request, Response } from "express"
import Hotel from "../models/hotel"
import { BookingType, HotelSearchResponse } from "../shared/types"
import { param, validationResult } from "express-validator"
import Stripe from "stripe"
import verifyToken from "../middleware/auth"

const stripe = new Stripe(process.env.STRIPE_API_KEY as string)

const router = express.Router()




router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {}

    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 }
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 }
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 }
        break;
    }
    const pageSize = 5
    const pageNumber = parseInt(req.query.page ? req.query.page.toString() : '1')
    const skip = (pageNumber - 1) * pageSize

    const hotels = await Hotel.find(query).sort(sortOptions).skip(skip).limit(pageSize)

    const total = await Hotel.countDocuments(query)

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize)
      }
    }

    res.json(response)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Ocorreu um erro, tente novamente mais tarde" })
  }
})

router.get("/:id", [param("id").notEmpty().withMessage("ID do hotel é obrigatório")], async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const id = req.params.id.toString()

  try {
    const hotel = await Hotel.findById(id);
    res.json(hotel)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Erro ao carregar o hotel" })
  }
})
router.post("/:hotelId/bookings/payment-intent", verifyToken, async (req: Request, res: Response) => {
  const { numberOfNights } = req.body
  const hotelId = req.params.hotelId

  const hotel = await Hotel.findById(hotelId)

  if (!hotel) {
    return res.status(400).json({ message: "Hotel não encontrado" })
  }

  const totalCost = hotel.pricePerNight * numberOfNights

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCost * 100,
    currency: "brl",
    metadata: {
      hotelId,
      userId: req.userId
    }
  })
  if (!paymentIntent.client_secret) {
    return res.status(500).json({ message: "Erro ao gerar pagamento" })
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost
  }

  res.send(response)
})

router.post("/:hotelId/bookings", verifyToken, async (req: Request, res: Response) => {
  try {
    const paymentIntentId = req.body.paymentIntentId
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string)
    if (!paymentIntent) {
      return res.status(400).json({ message: "Forma de pagamento não encontrada" })
    }
    if (paymentIntent.metadata.hotelId !== req.params.hotelId || paymentIntent.metadata.userId !== req.userId) {
      return res.status(400).json({ message: "Erro ao gerar pagamento" })
    }

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ message: `Não foi possível gerar pagamento. status: ${paymentIntent.status}` })
    }

    const newBooking: BookingType = {
      ...req.body,
      userId: req.userId,
    }
    const hotel = await Hotel.findOneAndUpdate({ _id: req.params.hotelId }, {
      $push: { bookings: newBooking }
    })

    if(!hotel){
      return  res.status(400).json({message:"Hotel não encontrado"})
    }

    await hotel.save()

    res.status(200).send()
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Ocorreu um erro! tente novamente mais tarde" })
  }
})



const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};


export default router