
import { useQuery } from 'react-query'
import { useSearhContext } from '../contexts/searchContext'
import * as apiClient from "../api-client"
import { useState } from 'react'
import SearchResultCard from '../components/SearchResultCard'
import Pagination from '../components/Pagination'
import StarRatingFilter from '../components/StarRatingFilter'
import HoteTypesFilter from '../components/HoteTypesFilter'
import FacilitiesFilter from '../components/FacilitiesFilter'
import PriceFilter from '../components/PriceFilter'
const Search = () => {
    const search = useSearhContext()
    const [page,setPage] = useState<number>(1)

    const [selectedStars,setSelectedStars] = useState<string[]>([])
    const [selectedHotelTypes,setSelectedHotelTypes] = useState<string[]>([])
    const [selectedFacilities,setSelectsFacilities] = useState<string[]>([])
    const [selectedPrice,setSeletedPrice] = useState<number| undefined>()
    const [sortOption,setSortOption] = useState<string>("")
    const searchParams = {
      destination:search.destination,
      checkIn:search.checkIn.toISOString(),
      checkOut:search.checkOut.toISOString(),
      adultCount:search.adultCount.toString(),
      childCount:search.childCount.toString(),
      page:page.toString(),
      stars:selectedStars,
      types:selectedHotelTypes,
      facilities:selectedFacilities,
      maxPrice:selectedPrice?.toString(),
      sortOption
    }

  const {data:hotelData} = useQuery(["searchHotels",searchParams],() => apiClient.searchHotels(searchParams)) 

  const handleStars = (event:React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value

    setSelectedStars((prevStars) => event.target.checked ? [...prevStars,starRating] : prevStars.filter((star) => star !== starRating))
  }
  const handleHotelTypeChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const hotelType = event.target.value

    setSelectedHotelTypes((preveHotelTypes) => event.target.checked ? [...preveHotelTypes,hotelType] : preveHotelTypes.filter((hoteltypeName) => hoteltypeName !== hotelType))
  }
  const handleeHotelFacilities = (event:React.ChangeEvent<HTMLInputElement>) => {
    const hotelFacility = event.target.value
    setSelectsFacilities((prevHotelFacility) => event.target.checked ? [...prevHotelFacility,hotelFacility] : prevHotelFacility.filter((facilityName) => facilityName !== hotelFacility)) 
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">Filtrar por:</h3>
            <StarRatingFilter selectedStars={selectedStars} onChange={handleStars} />
            <HoteTypesFilter selectedHotelTypes={selectedHotelTypes} onChange={handleHotelTypeChange} />
            <FacilitiesFilter selectedFacilities={selectedFacilities} onChange={handleeHotelFacilities}/>
            <PriceFilter selectedPrice={selectedPrice} onChange={(value?:number) => setSeletedPrice(value)}/>
          </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination.total} Hoteis encontrados
            {search.destination ? ` em ${search.destination}`: ""}
          </span>
          <select name="" id="" value={sortOption} onChange={(event) =>setSortOption(event.target.value) } className='p-2 border rounded-md'>
            <option value="">Ordernar por</option>
            <option value="startRating">Nº de Estrelas</option>
            <option value="pricePerNightAsc">Diária (ordem crescente)</option>
            <option value="priceperNightdesc">Diária (ordem decrescente)</option>
          </select>
        </div>
        {hotelData?.data.map((hotel) => (
          <SearchResultCard hotel={hotel}/>
        ))}
        <div>
          <Pagination page={hotelData?.pagination.page || 1} pages={hotelData?.pagination.pages || 1} onPageChange={(page) => setPage(page)} />
        </div>
      </div>
    </div>
  )
}

export default Search