import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import logo from "../assets/images/rosatom-logo.png";

function TicketUploadPage() {
  const BASE_URL = "http://192.168.0.120:8000";
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = location.state || {};
  const [ticketType, setTicketType] = useState(localStorage.getItem("ticketType") || "air");
  const [files, setFiles] = useState({ ticketFile: [], hotelFile: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [parsedData, setParsedData] = useState({});

  useEffect(() => {
    if (!ticketType) {
      navigate("/ticket-type");
    }
  }, [ticketType, navigate]);

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({
      ...prev,
      [name]: Array.from(selectedFiles),
    }));
  };

  const splitFilesByType = (fileArray) => {
    const pdfFiles = [];
    const imageFiles = [];

    for (const file of fileArray) {
      if (file.type === "application/pdf") {
        pdfFiles.push(file);
      } else if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg"
      ) {
        imageFiles.push(file);
      }
    }

    return { pdfFiles, imageFiles };
  };

  const getUploadUrl = (isPdf) => {
    if (ticketType === "air") {
      return isPdf ? `${BASE_URL}/pdf/pdf_air_documents` : `${BASE_URL}/png/air_png_documents`;
    } else {
      return isPdf ? `${BASE_URL}/pdf/pdf_train_documents` : `${BASE_URL}/png/train_png_documents`;
    }
  };

  const uploadFiles = async (filesArray, url) => {
    const formData = new FormData();
    filesArray.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Ошибка при загрузке файлов");
    }

    return await response.json();
  };

  const handleUpload = async () => {
    if (files.ticketFile.length === 0 || files.hotelFile.length === 0) {
      setError("Загрузите все необходимые файлы");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { pdfFiles, imageFiles } = splitFilesByType(files.ticketFile);
      const ticketDataList = [];

      if (pdfFiles.length > 0) {
        const pdfUrl = getUploadUrl(true);
        const pdfData = await uploadFiles(pdfFiles, pdfUrl);
        ticketDataList.push(...pdfData);
      }

      if (imageFiles.length > 0) {
        const imgUrl = getUploadUrl(false);
        const imgData = await uploadFiles(imageFiles, imgUrl);
        ticketDataList.push(...imgData);
      }

      const hotelUrl = `${BASE_URL}/png/hotel_checks`;
      const hotelDataList = await uploadFiles(files.hotelFile, hotelUrl);

      setParsedData({
        ticketData: ticketDataList,
        hotelData: hotelDataList,
      });

      setUploadComplete(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTranslatedTicketType = (type) => {
    return type === "air" ? "Авиабилеты" : type === "train" ? "Ж/Д билеты" : type;
  };

  const renderFileUpload = (label, name) => {
    const uploadedCount = files[name]?.length || 0;

    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">{label}</h2>
        <label className="flex flex-col items-center justify-center w-64 h-40 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer text-center">
          {uploadedCount > 0 ? (
            <FaCheckCircle size={50} className="text-green-500 mb-2" />
          ) : (
            <FaCloudUploadAlt size={50} className="text-gray-500 mb-2" />
          )}
          <span className="text-gray-600">
            {uploadedCount > 0
              ? `Загружено файлов: ${uploadedCount}`
              : "Выберите один или несколько файлов"}
          </span>
          <input type="file" name={name} multiple onChange={handleFileChange} className="hidden" />
        </label>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <a href="/">
        <img src={logo} alt="Rosatom Logo" className="absolute top-3 left-5 w-14" />
      </a>

      <h1 className="text-2xl font-bold mb-8">Загрузка документов</h1>

      <div className="flex flex-col space-y-6">
        {renderFileUpload("Билеты", "ticketFile")}
        {renderFileUpload("Отель", "hotelFile")}
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
            navigate("/final", {
              state: {
                userInfo,
                ticketType: getTranslatedTicketType(ticketType),
                ticketData: parsedData.ticketData,
                hotelData: parsedData.hotelData,
              },
            });
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
