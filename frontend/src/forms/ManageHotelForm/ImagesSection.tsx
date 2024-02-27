import { useFormContext } from "react-hook-form"
import { HotelFormData } from "./ManageHotelForm"


const ImagesSection = () => {
    const {register,formState:{errors}} = useFormContext<HotelFormData>()
  return (
    <div>
        <h2 className="text-2xl font-bold mb-3">Imagens</h2>
        <div className="border rounded p-4 flex flex-col gap-4">
            <input type="file" multiple accept="image/*" className="w-full text-gray-700 font-normal" {...register('imageFiles',{
                validate:(imageFiles) => {
                    const totalLength = imageFiles.length
                    if (totalLength === 0) {
                        return "Pelo menos 1 imagem deve ser adicionada"
                    }
                    if(totalLength > 6){
                        return "Número de imagens adicionadas maior que 6"
                    }

                    return true
                }
            })} />
        </div>
        {errors.imageFiles && (
            <span className="text-red-500 text-sm font-bold">{errors.imageFiles.message}</span>
        )}
    </div>
  )
  
}

export default ImagesSection