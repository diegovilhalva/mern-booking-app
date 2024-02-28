import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {hotelType} from "../../backend/src/shared/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URl || ""

export const register = async (formData:RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`,{
        method:'POST',
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
 })

    const responseBody = await response.json()

    if (!response.ok) {
        throw  new Error(responseBody.message)
    }


}


export const signin = async (formData:SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`,{
        method:'POST',
        credentials:"include",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    })

    const body = await response.json()

    if (!response.ok) {
        throw new Error(body.message)
    }

    return body;
}

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`,{
        credentials:"include"
    })

    if (!response.ok) {
        throw new Error("Token inválido")
    }

    return response.json()

}



export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`,{
        credentials:"include",
        method:"POST"
    })

    if (!response.ok) {
        throw new Error("Ocorreu um erro ao sair")
    }
}

export const addMyHotel = async (hotelFormData:FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        method:"POST",
        credentials:"include",
        body:hotelFormData
    })

    if (!response.ok) {
        throw new Error("Erro ao adicionar hotel")
    }

    return response.json()
}

export const fetchMyHotels = async ():Promise<hotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
        credentials:"include"
    })

    if (!response.ok) {
        throw new Error("Erro ao carregar o conteúdo")
    }

    return response.json()

} 