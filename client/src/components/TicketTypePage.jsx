import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlane, FaTrain } from 'react-icons/fa';
import logo from "../assets/images/rosatom-logo.png";

function TicketTypePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = location.state || {};
  const [selectedTicket, setSelectedTicket] = useState(localStorage.getItem('ticketType') || null);

  useEffect(() => {
    if (selectedTicket) {
      localStorage.setItem('ticketType', selectedTicket);
    }
  }, [selectedTicket]);

  const handleNext = () => {
    if (selectedTicket) {
      navigate('/ticket-upload', { state: { userInfo, ticketType: selectedTicket } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 pt-40">
      <a href="/">
        <img src={logo} alt="Rosatom Logo" className="absolute top-3 left-5 w-14"/>
      </a>
      <h1 className="text-2xl font-bold mb-8 text-center">Каким способом вы путешествовали?</h1>
      
      <div className="flex space-x-8 mb-8">
        <button 
          onClick={() => setSelectedTicket('air')} 
          className={`flex flex-col items-center justify-center w-48 h-48 rounded-2xl shadow-lg transition ${
            selectedTicket === 'air' ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FaPlane size={60} className="mb-4" />
          <span className="text-lg">Авиабилеты</span>
        </button>

        <button 
          onClick={() => setSelectedTicket('train')} 
          className={`flex flex-col items-center justify-center w-48 h-48 rounded-2xl shadow-lg transition ${
            selectedTicket === 'train' ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <FaTrain size={60} className="mb-4" />
          <span className="text-lg">ЖД билеты</span>
        </button>
      </div>

      <button 
        onClick={handleNext} 
        disabled={!selectedTicket}
        className={`px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md transition-all ${
          selectedTicket ? 'bg-black-600 text-white hover:bg-blue-800 hover:shadow-2xl hover:shadow-purple-500/50 hover:ring-4 hover:ring-blue-500 hover:ring-opacity-20' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        }`}
      >
        Далее
      </button>
    </div>
  );
}

export default TicketTypePage;
