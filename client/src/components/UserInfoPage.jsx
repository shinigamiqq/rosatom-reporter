import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/images/rosatom-logo.png";

function UserInfoPage() {
  const [userInfo, setUserInfo] = useState({ name: '', department: '', rank: '', perDay: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    navigate('/ticket-type', { state: userInfo });
  };

  return (
    <div className="p-6 pt-40 relative">
      <a href="/">
        <img src={logo} alt="Rosatom Logo" className="absolute top-3 left-5 w-14"/>
      </a>
      <h1 className="text-2xl mb-4">Введите данные</h1>
      <input name="name" placeholder="ФИО" value={userInfo.name} onChange={handleChange} className="block w-full mb-4 p-2" />
      <input name="department" placeholder="Департамент" value={userInfo.department} onChange={handleChange} className="block w-full mb-4 p-2" />
      <input name="rank" placeholder="Ранг" value={userInfo.rank} onChange={handleChange} className="block w-full mb-4 p-2" />
      <input name="perDay" placeholder="Посуточные" value={userInfo.perDay} onChange={handleChange} className="block w-full mb-4 p-2" />
      <button onClick={handleSubmit} className="px-6 py-3 bg-black-600 text-white hover:bg-blue-800 hover:shadow-2xl hover:shadow-purple-500/50 
             hover:ring-4 hover:ring-blue-500 hover:ring-opacity-20 rounded-lg">Далее</button>
    </div>

  );
}

export default UserInfoPage;

