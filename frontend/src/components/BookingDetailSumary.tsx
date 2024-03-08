import { hotelType } from "../../../backend/src/shared/types";

type Props = {
    checkIn: Date;
    checkOut: Date;
    adultCount: number;
    childCount: number;
    numberOfNights: number;
    hotel: hotelType;
}




const BookingDetailSumary = ({ checkIn, checkOut, adultCount, childCount, numberOfNights, hotel }: Props) => {

    return (
        <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
            <h1 className="text-xl font-bold">Detalhes da reserva</h1>
            <div className="border-b py-2">
                Localidade: <div className="font-bold">{`${hotel.name}, ${hotel.city},${hotel.country}`}</div>
            </div>
            <div className="flex justify-between">
                <div>
                    Entrada
                    <div className="font-bold">{checkIn.toLocaleDateString('pt-br', {
                        year: 'numeric',
                        month: 'short',
                        weekday: 'short',
                        day: 'numeric',
                    })}</div>
                </div>
                <div>
                    Saída
                    <div className="font-bold">{checkOut.toLocaleDateString('pt-br', {
                        year: 'numeric',
                        month: 'short',
                        weekday: 'short',
                        day: 'numeric',
                    })}</div>
                </div>
            </div>
            <div className="border-t border-b py-2">
                Estadia
                <div className="font-bolder">
                    {numberOfNights} {numberOfNights > 1 ? "dias": "dia"}
                </div>
            </div>
            <div className="border-t border-b py-2">
                Acompanhantes
                <div className="font-bold">{adultCount} {adultCount > 1 ? "Adultos" : "Adulto"} & {childCount} {childCount > 1 ? "Crianças" : "Criança" }</div>
            </div>
        </div>
    )
}

export default BookingDetailSumary