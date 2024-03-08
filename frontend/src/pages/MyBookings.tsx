import { useQuery } from "react-query"
import * as apiClient from "../api-client"

const MyBookings = () => {
    const { data: hotels } = useQuery("fetchMyBookings", apiClient.fetchMybookings)
    if (!hotels || hotels.length === 0) {
        return <span>Ainda não há reservas!</span>
    }
    return (
        <div className="space-y-5">
            <h1 className="text-3xl font-bold">Minhas Reservas</h1>
            {hotels.map((hotel) => (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
                    <div className="lg:w-full lg:h-[250px]">
                        <img src={hotel.imageUrls[0]} alt={hotel.name} className="w-full h-full object-cover object-center" />
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                        <div className="text-2xl font-bold">
                            {hotel.name}
                            <div className="text-xs font-normal">
                                {hotel.city},{hotel.country}
                            </div>
                        </div>
                        {hotel.bookings.map((booking) => (
                        <div>
                            <div>
                                <span className="font-bold mr-2">Datas:</span>
                                <span>
                                {new Date(booking.checkIn).toLocaleDateString('pt-BR')}
                                     <span className="mx-2">-</span>

                                {new Date(booking.checkOut).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                            <div>
                                <span className="font-bold mr-2">Acompanhates:</span>
                                <span className="">
                                    {booking.adultCount} {booking.adultCount > 1 ? "Adultos": "Adulto"}, {booking.childCount} {booking.childCount > 1 ? "Crianças" : "Criança"}
                                </span>
                            </div>
                        </div>
                    ))}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default MyBookings