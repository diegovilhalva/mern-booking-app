import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"


const GuestSextion = () => {
    const {register,formState:{errors}} = useFormContext<HotelFormData>()
  return (
    <div>
        <h2 className="text-2xl font-bold mb-3">Acompanhantes</h2>
        <div className="grid grid-cols-2 p-6 gap-5 bg-gray-300">
            <label className="text-gray-700 text-sm font-semibold">
                Adultos
                <input type="number" className="border rounded w-full py-2 px-3 font-normal" min={1} {...register('adultCount',{
                    required:"Este campo é obrigatório",
                })} />
                  {errors.adultCount?.message && (
                <span className="text-red-500 text-sm font-bold">
                    {errors.adultCount?.message}
                </span>
            )}
            </label>
            <label className="text-gray-700 text-sm font-semibold">
                Crianças
                <input type="number" className="border rounded w-full py-2 px-3 font-normal" min={0} {...register('childCount',{
                    required:"Este campo é obrigatório",
                })} />
                  {errors.childCount?.message && (
                <span className="text-red-500 text-sm font-bold">
                    {errors.childCount?.message}
                </span>
            )}
            </label>
          
        </div>
    </div>
  )
}

export default GuestSextion