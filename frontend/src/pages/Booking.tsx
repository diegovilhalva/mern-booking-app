import { useQuery } from "react-query"
import * as apiClient from "../api-client"
import BookingForm from "../forms/BookingForm/BookingForm"
import { useSearhContext } from "../contexts/searchContext"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import BookingDetailSumary from "../components/BookingDetailSumary"
import { Elements } from "@stripe/react-stripe-js"
import { useAppContext } from "../contexts/AppContext"

const Booking = () => {
    const {stripePromise} = useAppContext()
    const search = useSearhContext()
    const { hotelId } = useParams()

    const [numberOfNights, setNumberOfNights] = useState<number>(0)

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24)
            setNumberOfNights(Math.ceil(nights))
        }

    }, [search.checkIn, search.checkOut])


    const {data:paymentIntentData} = useQuery("createPaymentIntent",() => apiClient.createPaymentIntent(hotelId as string,numberOfNights.toString()),
    {
        enabled:!!hotelId && numberOfNights > 0
    }
    )

    const { data: hotel } = useQuery(
        "fetchHotelById",
        () => apiClient.fetchHotelById(hotelId as string),
        {
            enabled: !!hotelId,
        }
    );
    const { data: currentUser } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser)
    if(!hotel){
        return <></>
    }
    return (
        <div className="grid md:grid-cols-[1fr_2fr] gap-1">
            <BookingDetailSumary
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                adultCount={search.adultCount}
                childCount={search.childCount}
                numberOfNights={numberOfNights}
                hotel={hotel}
            />
            {currentUser && paymentIntentData  && (<Elements stripe={stripePromise} options={{
                clientSecret:paymentIntentData.clientSecret
            }}>
                <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
            </Elements> )}

        </div>
    )
}

export default Booking