import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query";
import *  as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
export type SignInFormData = {
    email:string;
    password:string;
}



const SignIn = () => {
  const {showToast} = useAppContext()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const {register,formState:{errors},handleSubmit} = useForm<SignInFormData>()
  const mutation = useMutation(apiClient.signin,{
    onSuccess: async () => {
      showToast({message:"Bem vindo!",type:"SUCCESS"})
      await queryClient.invalidateQueries("validateToken")
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
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Fazer Login</h2>
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
        <span className="flex items-center justify-between">
          <span className="text-sm">
            Não tem uma conta? <Link className="underline" to="/register">Crie uma conta</Link>
          </span>

            <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                Entrar
            </button>
        </span>
    </form>
  )
}

export default SignIn