import { useState } from "react";

function HotelReceiptUploadPage() {
  const BASE_URL = "http://192.168.0.120:8000";
  const [hotelFile, setHotelFile] = useState(null);

  const handleFileChange = (e) => {
    setHotelFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${BASE_URL}/hotel_checks`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  };

  const handleUpload = async () => {
    if (hotelFile) {
      await uploadFile(hotelFile);
    }
  };

  return (
    <div className="p-10">
      <input type="file" name="hotelFile" onChange={handleFileChange} />
      <button onClick={handleUpload}>Загрузить чек</button>
    </div>
  );
}

export default HotelReceiptUploadPage;

