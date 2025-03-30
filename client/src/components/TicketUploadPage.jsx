import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import logo from "../assets/images/rosatom-logo.png";

function TicketUploadPage() {
  const BASE_URL = "http://192.168.0.120:8000";
  const navigate = useNavigate();
  const [ticketType, setTicketType] = useState(localStorage.getItem('ticketType') || "air");
  const [files, setFiles] = useState({ ticketFile: null, hotelFile: null });

  useEffect(() => {
    if (!ticketType) {
      navigate('/ticket-type');
    }
  }, [ticketType, navigate]);

  const handleFileChange = (e) => {
    setFiles((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));
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
    return response.json();
  };

  const handleUpload = async () => {
    if (files.ticketFile) {
      const url = getUploadUrl(files.ticketFile, ticketType);
      await uploadFile(files.ticketFile, url);
    }
    if (files.hotelFile) {
      await uploadFile(files.hotelFile, `${BASE_URL}/hotel_checks`);
    }
    navigate('/final-page');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={logo} alt="Rosatom Logo" className="absolute top-5 left-5 w-16" />
      <h1 className="text-2xl font-bold mb-8">Загрузка документов</h1>
      
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Билеты</h2>
          <label className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer">
            <FaCloudUploadAlt size={50} className="text-gray-500 mb-2" />
            <span className="text-gray-600">Загрузите файл</span>
            <input type="file" name="ticketFile" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Отель</h2>
          <label className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer">
            <FaCloudUploadAlt size={50} className="text-gray-500 mb-2" />
            <span className="text-gray-600">Загрузите файл</span>
            <input type="file" name="hotelFile" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      </div>

      <button 
        onClick={handleUpload} 
        className="mt-8 px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        Загрузить файлы
      </button>
    </div>
  );
}

export default TicketUploadPage;
