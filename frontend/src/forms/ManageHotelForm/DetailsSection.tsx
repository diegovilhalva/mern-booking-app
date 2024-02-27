import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"


const DetailsSection = () => {
    const { register,formState:{errors} } = useFormContext<HotelFormData>()

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-3">Adicionar Hotel</h1>
            <label  className="text-gray-700 text-sm font-bold flex-1">
                Nome
                <input type="text" className="border rounded w-full py-1 px-2 font-normal"  {...register("name",{required:"Este campo é obrigatório"})} />
                {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                )}
        </label>
        <div className="flex gap-4 ">
        <label  className="text-gray-700 text-sm font-bold flex-1">
                Localidade
                <input type="text" className="border rounded w-full py-1 px-2 font-normal"  {...register("city",{required:"Este campo é obrigatório"})} />
                {errors.city && (
                    <span className="text-red-500">{errors.city.message}</span>
                )}
        </label>
        <label  className="text-gray-700 text-sm font-bold flex-1">
                País
                <input type="text" className="border rounded w-full py-1 px-2 font-normal"  {...register("country",{required:"Este campo é obrigatório"})} />
                {errors.country && (
                    <span className="text-red-500">{errors.country.message}</span>
                )}
        </label>
        </div>
        <label  className="text-gray-700 text-sm font-bold flex-1">
                Descrição do hotel:
                <textarea rows={10}  className="border rounded w-full py-1 px-2 font-normal"  {...register("description",{required:"Este campo é obrigatório"})} ></textarea>
                {errors.description && (
                    <span className="text-red-500">{errors.description.message}</span>
                )}
        </label>
        <label  className="text-gray-700 text-sm font-bold max-w-[50%]">
                Diária
                <input type="number" min={1} className="border rounded w-full py-1 px-2 font-normal"  {...register("pricePerNight",{required:"Este campo é obrigatório"})} />
                {errors.pricePerNight && (
                    <span className="text-red-500">{errors.pricePerNight.message}</span>
                )}
        </label>
        <label  className="text-gray-700 text-sm font-bold max-w-[50%]">
                Classificação por estrelas
                <select {...register("starRating",{
                    required:"Este campo é obrigatório"
                })} className="border rounded w-full p-2 text-gray-700 font-normal">
                    <option value="" className="text-sm font-bold">
                        Escolha uma classificação
                    </option>
                    {[1, 2, 3, 4, 5].map((num) => (
                    <option value={num}>{num}</option>
                        ))}
                </select>
                {errors.starRating && (
                    <span className="text-red-500">{errors.starRating.message}</span>
                )}
        </label>
        
    </div>
    )
}

export default DetailsSection