import { useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/images/rosatom-logo.png";

function FinalPage() {
  const BASE_URL = "http://192.168.0.120:8000";
  const location = useLocation();
  const { userInfo, ticketType, ticketData, hotelData } = location.state || {};

  const [tickets, setTickets] = useState(Array.isArray(ticketData) ? ticketData : [ticketData]);
  const [hotels, setHotels] = useState(Array.isArray(hotelData) ? hotelData : [hotelData]);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTicketChange = (index, field, value) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const handleHotelChange = (index, field, value) => {
    const updated = [...hotels];
    updated[index][field] = value;
    setHotels(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const requestData = {
      full_name: userInfo.userInfo.name || "Неизвестно",
      department: userInfo.userInfo.department || "Неизвестно",
      id: userInfo.userInfo.id || 0,
      rang: userInfo.userInfo.rang || "Неизвестно",
      daily_allowance: userInfo.userInfo.perDay || 0,
      tickets: tickets.map((t) => ({
        filename: t.filename || "N/A",
        Date: t.Date || "N/A",
        Price: Number(t.Price) || 0,
        Ticket: t.Ticket || "N/A",
        TicketType: ticketType || "N/A",
      })),
      hotels: hotels.map((h) => ({
        filename: h.filename || "N/A",
        Date: h.Date || "N/A",
        Price: Number(h.Price) || 0,
      })),
    };

    try {
      const response = await fetch(`${BASE_URL}/report/create_report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Ошибка при создании отчета");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Advance_Report.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-900 text-white p-8 min-h-screen">
      <a href="/">
        <img src={logo} alt="Rosatom Logo" className="absolute top-3 left-5 w-14" />
      </a>
      <h1 className="text-2xl font-bold mb-4 mt-24 text-center">Проверьте данные</h1>
      <p className="text-gray-300 text-center mb-4">
        Убедитесь, что все данные корректны перед созданием отчета.
      </p>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-600 transition-transform duration-300"
          aria-label="Toggle details"
        >
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ${
              showDetails ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {showDetails && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Билеты</h2>
            {tickets.map((ticket, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                {["Date", "Price", "Ticket", "filename"].map((field) => (
                  <input
                    key={field}
                    type={field === "Price" ? "number" : "text"}
                    className="bg-gray-800 text-white p-2 rounded-md border border-gray-600"
                    value={ticket[field] || ""}
                    onChange={(e) => handleTicketChange(index, field, e.target.value)}
                    placeholder={field}
                  />
                ))}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Отели</h2>
            {hotels.map((hotel, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                {["Date", "Price", "filename"].map((field) => (
                  <input
                    key={field}
                    type={field === "Price" ? "number" : "text"}
                    className="bg-gray-800 text-white p-2 rounded-md border border-gray-600"
                    value={hotel[field] || ""}
                    onChange={(e) => handleHotelChange(index, field, e.target.value)}
                    placeholder={field}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      <div className="flex justify-center mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md transition-all ${
            loading && "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Создание отчета..." : "Создать отчет"}
        </button>
      </div>
    </div>
  );
}

export default FinalPage;
