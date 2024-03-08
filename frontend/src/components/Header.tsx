import {Link} from "react-router-dom"
import { useAppContext } from "../contexts/AppContext"
import SignOutButton from "./SignOutButton"


const Header = () => {
  const {isLoggedIn} = useAppContext()
  return (
    <div className="bg-blue-800 py-6">
        <div className="container mx-auto flex justify-between">
            <span className="text-3xl text-white font-bold tracking-tight">
                <Link to={'/'}>MernHolidays.com</Link>
            </span>
            <span className="flex space-x-2">
               {isLoggedIn ? (<>
                <Link to="/my-bookings" className="flex items-center text-white px-3 font-bold hover:bg-blue-600">Minhas Reservas</Link>
                <Link to="/my-hotels" className="flex items-center text-white px-3 font-bold hover:bg-blue-600">Meus Hoteis</Link>
                <SignOutButton/>
               </>):( <Link to={'/sign-in'} className="flex items-center bg-white text-blue-600 px-3 font-bold hover:bg-gray-100">Login</Link>)}
            </span>
        </div>
    </div>
  )
}

export default Header