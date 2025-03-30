import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/images/background2.png";
import logo from "../assets/images/rosatom-logo.png";


export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-cover bg-center" style={{
      backgroundImage: `url(${backgroundImage})`, 
      backgroundPosition: "center center",
      backgroundSize: "cover"
      }}
    >
      <img src={logo} alt="Rosatom Logo" className="absolute top-3 left-5 w-14" />
      <button 
        className="px-10 py-3 text-white bg-black-600 rounded-lg text-xl shadow-lg hover:bg-green-800 transition" 
        onClick={() => navigate('/user-info')}
      >
        Начать
      </button>
    </div>
  );
}

