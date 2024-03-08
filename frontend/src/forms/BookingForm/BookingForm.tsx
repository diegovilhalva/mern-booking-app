import { useForm } from "react-hook-form";
import { PaymentIntentResponse, UserType } from "../../../../backend/src/shared/types"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useSearhContext } from "../../contexts/searchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client"
import { useAppContext } from "../../contexts/AppContext";

type Props = {
    currentUser: UserType;
    paymentIntent: PaymentIntentResponse;
}
export type BookingFormData = {
    firstName: string;
    lastName: string;
    email: string;
    adultCount:number;
    childCount:number;
    checkIn:string;
    checkOut:string;
    hotelId:string;
    paymentIntentId:string;
    totalCost:number
}

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
    const stripe = useStripe()
    const elements = useElements()

    const search = useSearhContext()
    const {hotelId} = useParams()

    const {showToast} = useAppContext()
    
    const {mutate:bookRoom,isLoading} = useMutation(apiClient.createBooking,{
        onSuccess:() => {
                showToast({message:"Reserva feita com sucesso!",type:"SUCCESS"})
        },
        onError:() => {
               showToast({message:"Erro ao confirmar reserva!",type:"ERROR"})
        }
    })


    const { handleSubmit, register } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            adultCount:search.adultCount,
            childCount:search.childCount,
            checkIn:search.checkIn.toISOString(),
            checkOut:search.checkOut.toISOString(),
            hotelId:hotelId,
            totalCost:paymentIntent.totalCost,
            paymentIntentId:paymentIntent.paymentIntentId
        }
    })

    const onSubmit = async (formData: BookingFormData) => {
        if (!stripe || !elements) {
            return;
        }
        const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement) as StripeCardElement

            }
        }
        );
        if (result.paymentIntent?.status === "succeeded") {
            bookRoom({...formData,paymentIntentId:result.paymentIntent.id})
        }

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5">
            <span className="text-3xl font-bold">Confirme seus dados</span>
            <div className="grid grid-cols-2 gap-6">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Nome
                    <input type="text" className="mt-1 border
                 rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" readOnly disabled {...register("firstName")} />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Sobrenome
                    <input type="text" className="mt-1 border
                 rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" readOnly disabled {...register("lastName")} />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    E-mail
                    <input type="email" className="mt-1 border
                 rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" readOnly disabled {...register("email")} />
                </label>
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Valor da reserva</h2>
            </div>
            <div className="bg-blue-200 p-4 rounded-md">
                <div className="font-semibold text-lg">
                    Valor Total: {paymentIntent.totalCost.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-semibold">Detalhes do pagamento</h3>
                <CardElement id="payment-element" className="border rounded-md p-2 text-sm" />
            </div>
            <div className="flex justify-end">
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500">
                    {isLoading ? "Salvando...":" Confirmar reserva"}
                   
                </button>
            </div>
        </form>
    )
}

export default BookingForm