import { AiFillStar } from "react-icons/ai"
import { hotelType } from "../../../backend/src/shared/types"
import { Link } from "react-router-dom"

type Props = {
    hotel: hotelType
}

const SearchResultCard = ({ hotel }: Props) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
            <div className="w-full h-[300px]">
                <img src={hotel.imageUrls[0]} className="w-full h-full object-cover object-center" alt="" />
            </div>
            <div className="grid grid-rows-[1fr_2fr_1fr]">
                <div>
                    <div className="flex items-center">
                        <span className="flex">
                            {Array.from({ length: hotel.starRating }).map(() => (
                                <AiFillStar className="fill-yellow-400 " />
                            ))}
                        </span>
                        <span className="ml-1 text-sm">{hotel.type}</span>
                    </div>
                    <Link to={`/detail/${hotel._id}`} className="text-2xl font-bold cursor-pointer">{hotel.name}</Link>
                </div>
                <div>
                    <div className="line-clamp-4 ">
                        {hotel.description}
                    </div>
                </div>
                <div>

                    <div className="grid grid-cols-2 items-end whitespace-nowrap">
                        <div className="flex gap-1 items-center">
                            {hotel.facilities.slice(0, 2).map((facility) => (
                                <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap">{facility}</span>
                            ))}
                            <span className="text-sm">{hotel.facilities.length > 2 && `e + ${hotel.facilities.length - 2}`}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="font-extrabold text-lg"> <strong> {hotel.pricePerNight.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })} </strong>diária</span>
                            <Link to={`/detail/${hotel._id}`} className="bg-blue-600 text-white h-full p-2 font-bold text-xl max-w-fit hover:bg-blue-500">Mais detalhes</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchResultCard