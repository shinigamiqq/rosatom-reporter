import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import logo from "../assets/images/rosatom-logo.png";

function TicketUploadPage() {
  const BASE_URL = "http://192.168.0.120:8000";
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = location.state || {};
  const [ticketType, setTicketType] = useState(localStorage.getItem('ticketType') || "air");
  const [files, setFiles] = useState({ ticketFile: null, hotelFile: null });
  const [uploaded, setUploaded] = useState({ ticketFile: false, hotelFile: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [parsedData, setParsedData] = useState({});

  useEffect(() => {
    if (!ticketType) {
      navigate('/ticket-type');
    }
  }, [ticketType, navigate]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: files[0] }));
      setUploaded((prev) => ({ ...prev, [name]: true }));
    }
  };

  const getUploadUrl = (file, type) => {
    const isPdf = file.type === "application/pdf";
    if (type === "air") {
      return isPdf ? `${BASE_URL}/pdf_air_documents` : `${BASE_URL}/air_png_documents`;
    } else {
      return isPdf ? `${BASE_URL}/pdf_train_documents` : `${BASE_URL}/train_png_documents`;
    }
  };

  const uploadFile = async (file, url) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(url, { method: "POST", body: formData });
    if (!response.ok) {
      throw new Error("Ошибка при загрузке файла");
    }
    return response.json();
  };

  const handleUpload = async () => {
    if (!files.ticketFile || !files.hotelFile) {
      setError("Загрузите все файлы перед продолжением");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ticketUrl = getUploadUrl(files.ticketFile, ticketType);
      const ticketData = await uploadFile(files.ticketFile, ticketUrl);
      const hotelData = await uploadFile(files.hotelFile, `${BASE_URL}/hotel_checks`);

      setParsedData({
        ticketData: { Date: ticketData.Date, Price: ticketData.Price },
        hotelData: { Date: hotelData.Date, Price: hotelData.Price }
      });
      console.log(ticketData);
      setUploadComplete(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedTicketType = (ticketType) => {
    return ticketType === 'air' ? 'Авиабилеты' : ticketType === 'train' ? 'Ж/Д билеты' : ticketType;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <a href="/">
        <img src={logo} alt="Rosatom Logo" className="absolute top-3 left-5 w-14"/>
      </a>
      <h1 className="text-2xl font-bold mb-8">Загрузка документов</h1>

      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Билеты</h2>
          <label className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer">
            {uploaded.ticketFile ? (
              <FaCheckCircle size={50} className="text-green-500 mb-2" />
            ) : (
              <FaCloudUploadAlt size={50} className="text-gray-500 mb-2" />
            )}
            <span className="text-gray-600">{uploaded.ticketFile ? "Файл загружен" : "Выберите файл"}</span>
            <input type="file" name="ticketFile" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Отель</h2>
          <label className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer">
            {uploaded.hotelFile ? (
              <FaCheckCircle size={50} className="text-green-500 mb-2" />
            ) : (
              <FaCloudUploadAlt size={50} className="text-gray-500 mb-2" />
            )}
            <span className="text-gray-600">{uploaded.hotelFile ? "Файл загружен" : "Выберите файл"}</span>
            <input type="file" name="hotelFile" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {!uploadComplete ? (
        <button 
          onClick={handleUpload} 
          className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-800 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Загрузить файлы"}
        </button>
      ) : (
        <button 
          onClick={() => {
            const translatedTicketType = getTranslatedTicketType(ticketType);  // Преобразование типа билета
            const { ticketData, hotelData } = parsedData;
            navigate('/final', { state: { userInfo, ticketType: translatedTicketType, ticketData, hotelData } });
          }} 
          className="mt-8 px-6 py-3 bg-green-600 text-white text-lg rounded-lg shadow-lg hover:bg-green-800 transition"
        >
          Продолжить
        </button>
      )}
    </div>
  );
}

export default TicketUploadPage;
