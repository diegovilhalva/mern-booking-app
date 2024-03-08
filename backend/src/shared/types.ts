

export type UserType =  {
    _id:string;
    email:string;
    password:string;
    firstName:string;
    lastName:string;
}


export type hotelType = {
    _id: string;
    userId: string;
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string[];
    lastUpdated: Date;
    bookings:BookingType[];
}

export type BookingType = {
    _id:string;
    userId:string;
    firstName:string;
    lastName:string;
    email:string;
    adultCount:number;
    childCount:number;
    checkIn:Date;
    checkOut:Date;
    totalCost:number;
}



export type HotelSearchResponse = {
    data:hotelType[];
    pagination:{
        total:number;
        page:number;
        pages:number;
    }
}


export type PaymentIntentResponse = {
    paymentIntentId:string;
    clientSecret:string;
    totalCost:number;
}