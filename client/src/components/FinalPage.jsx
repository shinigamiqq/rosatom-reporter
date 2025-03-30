import { useState } from "react";
import { useLocation } from "react-router-dom";

function FinalPage() {
  const BASE_URL = "http://192.168.0.120:8000";
  const location = useLocation();
  const parsedData = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const requestData = {
      full_name: parsedData.fullName || "Неизвестно",
      department: parsedData.department || "Неизвестно",
      id: parsedData.id || 0,
      rang: parsedData.rank || "Неизвестно",
      ticket_date: parsedData.ticketData?.Date || "Неизвестно",
      ticket_type: parsedData.ticketType || "Неизвестно",
      ticket_price: parsedData.ticketData?.Price ? parseFloat(parsedData.ticketData.Price.replace(/\s/g, "")) : 0,
      hotel_date: parsedData.hotelData?.Date || "Неизвестно",
      hotel_name: parsedData.hotelName || "Неизвестно",
      hotel_price: parsedData.hotelData?.Price ? parseFloat(parsedData.hotelData.Price.replace(/\s/g, "")) : 0,
      daily_allowance: parsedData.dailyAllowance ? parseFloat(parsedData.dailyAllowance) : 0
    };

    try {
      const response = await fetch(`${BASE_URL}/create_report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error("Ошибка при создании отчета");
      }

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Проверьте данные</h1>
      <p className="text-gray-700 mb-6">Убедитесь, что все данные корректны перед созданием отчета.</p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button 
        onClick={handleSubmit} 
        disabled={loading}
        className={`px-6 py-3 text-lg rounded-lg shadow-md transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {loading ? "Создание отчета..." : "Создать отчет"}
      </button>
    </div>
  );
}

export default FinalPage;
