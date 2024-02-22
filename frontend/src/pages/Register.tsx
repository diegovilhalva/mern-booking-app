import { useForm } from "react-hook-form"
import {  useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    confirmPassword:string
}

const Register = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const {showToast} = useAppContext()


    const {register,watch,handleSubmit,formState:{errors}} = useForm<RegisterFormData>()

    const mutation = useMutation(apiClient.register,{
        onSuccess: async () => {
            showToast({message:"Usuário registrado com sucesso",type:"SUCCESS"});
            await  queryClient.invalidateQueries("validateToken")
            navigate("/")
        },
        onError:(error:Error) => {
            showToast({message:error.message,type:"ERROR"})
        }
    })

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data)
    })

  return (
    <form  className="flex flex-col gap-5" onSubmit={onSubmit}>
        <h2 className="text-3xl font-bold">Crie sua conta</h2>
        <div className="flex flex-col md:flex-row gap-5">
            <label  className="text-gray-700 text-sm font-bold flex-1">
                Nome
                <input type="text" className="border rounded w-full py-1 px-2 font-normal" {...register("firstName",{required:"Este campo é obrigatório"})} />
                {errors.firstName && (
                    <span className="text-red-500">{errors.firstName.message}</span>
                )}
            </label>
            <label  className="text-gray-700 text-sm font-bold flex-1">
                Sobrenome
                <input type="text" className="border rounded w-full py-1 px-2 font-normal" {...register("lastName",{required:"Este campo é obrigatório"})} />
                {errors.lastName && (
                    <span className="text-red-500">{errors.lastName.message}</span>
                )}
            </label>
        </div>
        <label  className="text-gray-700 text-sm font-bold flex-1">
                E-mail
                <input type="email" className="border rounded w-full py-1 px-2 font-normal"  {...register("email",{required:"Este campo é obrigatório"})} />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
        </label>
        <label  className="text-gray-700 text-sm font-bold flex-1">
              Senha
                <input type="password" className="border rounded w-full py-1 px-2 font-normal"  {...register("password",{required:"Eeste campo é obrigatório",minLength:{value:6,
                message:"Senha deve possuir mais de 6  caracteres"}})} />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
        </label>
        <label  className="text-gray-700 text-sm font-bold flex-1">
             Confirme a senha
                <input type="password" className="border rounded w-full py-1 px-2 font-normal"  {...register("confirmPassword",{
                    validate:(val) => {
                        if (!val) {
                            return "Este campo é obrigatório"
                        }else if (watch("password") !== val){
                            return "As senhas não são iguais"
                        }
                    }
                })} />
                {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword.message}</span>
                )}

        </label>
        <span>
            <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                Criar conta
            </button>
        </span>
        
    </form>
  )
}

export default Register