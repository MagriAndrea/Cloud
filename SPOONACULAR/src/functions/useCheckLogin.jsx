import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function useCheckLogin() {
    const navigate = useNavigate()
    const location = useLocation()

    axios.get("http://localhost:4000/check-login")
    .then(() => {
        //Nel caso non dia errori, e non sono nella dashboard, vai nella dashboard
        if (location.pathname !=="/dashboard") {
            return navigate('/dashboard')
        }
    })
    .catch(() => {
        //Se non sono loggato (e non sono in login), vai su login
        if (location.pathname !=="/login") {
            return navigate('/login')
        }
    })
}

export default useCheckLogin