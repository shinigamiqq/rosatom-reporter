import { useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/images/rosatom-logo.png";

function FinalPage() {
  const BASE_URL = "http://192.168.0.120:8000";
  const location = useLocation();
  const { userInfo, ticketType, ticketData, hotelData } = location.state || {};
  console.log("Полученные данные:", {userInfo, ticketType, ticketData, hotelData});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const ticketsArray = Array.isArray(ticketData) ? ticketData : [ticketData];
    const hotelsArray = Array.isArray(hotelData) ? hotelData : [hotelData];

    const requestData = {
      full_name: userInfo.userInfo.name || "Неизвестно",
      department: userInfo.userInfo.department || "Неизвестно",
      id: userInfo.userInfo.id || 0,
      rang: userInfo.userInfo.rang || "Неизвестно",
      daily_allowance: userInfo.userInfo.perDay || 0,
      tickets: ticketsArray.map((t) => ({
        filename: t.filename || "N/A",
        Date: t.Date || "N/A",
        Price: t.Price || 0,
        Ticket: t.Ticket || "N/A",
        TicketType: ticketType || "N/A",
      })),
      hotels: hotelsArray.map((h) => ({
        filename: h.filename || "N/A",
        Date: h.Date || "N/A",
        Price: h.Price || 0,
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
    <div className="flex flex-col items-center justify-center h-screen">
      <a href="/">
        <img src={logo} alt="Rosatom Logo" className="absolute top-3 left-5 w-14" />
      </a>
      <h1 className="text-2xl font-bold mb-6">Проверьте данные</h1>
      <p className="text-gray-700 mb-6">
        Убедитесь, что все данные корректны перед созданием отчета.
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`px-6 py-3 text-lg rounded-lg shadow-md transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black-600 text-white hover:bg-blue-800 hover:shadow-2xl hover:shadow-purple-500/50 hover:ring-4 hover:ring-blue-500 hover:ring-opacity-10"
        }`}
      >
        {loading ? "Создание отчета..." : "Создать отчет"}
      </button>
    </div>
  );
}

export default FinalPage;
