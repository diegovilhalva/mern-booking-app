import { useQuery } from "react-query"
import { Link } from "react-router-dom"
import * as apiClient from "../api-client"
import { BsBuilding, BsMap } from "react-icons/bs"
import { BiHotel, BiMoney, BiStar } from "react-icons/bi"


const MyHotels = () => {
    const {data:hotelData} = useQuery("fetchMyHotels",apiClient.fetchMyHotels,{
        onError:() => {
            
        }
    })

    if (!hotelData) {
        return <span>Ainda não há hoteis</span>
    }
  return (
    <div className="space-y-5">
        <span className="flex justify-between">
            <h1 className="text-3xl font-bold">Meus Hoteis</h1>
            <Link className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500" to="/add-hotel">Adicionar Hotel</Link>
        </span>
        <div className="grid grid-cols-1 gap-8">
            {hotelData?.map((hotel) => (
                <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
                    <h2 className="text-2xl font-bold">{hotel.name}</h2>
                    <div className="whitespace-pre-line text-gray-700">
                        {hotel.description}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BsMap className="mr-1"/>
                            {hotel.city}, {hotel.country}
                        </div>
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BsBuilding className="mr-1"/>
                            {hotel.type}
                        </div>
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BiMoney className="mr-1"/>
                             R${hotel.pricePerNight} diária
                        </div>
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BiHotel className="mr-1"/>
                            {hotel.adultCount} {hotel.adultCount > 1 ? 'Adultos' :'Adulto' } ,
                            {hotel.childCount} {hotel.childCount > 1 ? 'Crianças' :'Criança' }  
                        </div>
                        <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                            <BiStar className="mr-1"/>
                            {hotel.starRating} {hotel.starRating > 1 ? 'Estrelas': 'Estrela'}
                        </div>
                        
                    </div>
                    <span className="flex justify-end">
                        <Link className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500" to={`/edit-hotel/${hotel._id}`}>Mais detalhes</Link>
                    </span>
                </div>
            ))}
        </div>
    </div>
  )
}

export default MyHotels