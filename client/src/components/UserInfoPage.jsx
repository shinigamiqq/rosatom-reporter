import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import logo from "../assets/images/rosatom-logo.png";

function UserInfoPage() {
  const [userInfo, setUserInfo] = useState({ name: '', id: '', department: '', rang: '', perDay: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (selectedOption) => {
    setUserInfo((prev) => ({ ...prev, department: selectedOption?.value || '' }));
  };

  const handleSubmit = () => {
    navigate('/ticket-type', { state: userInfo });
  };

  const departments = [
    { value: 'ЦЦТ_Центр цифровых технологий', label: 'ЦЦТ_Центр цифровых технологий' },
    { value: 'ОНСИ_Отдел ведения НСИ', label: 'ОНСИ_Отдел ведения НСИ' },
    { value: 'ДУП_Департамент управления проектами', label: 'ДУП_Департамент управления проектами' },
    { value: 'ДТИС_Департамент технологических  информационных систем', label: 'ДТИС_Департамент технологических  информационных систем' },
    { value: 'ДОП_Департамент обеспечения производства', label: 'ДОП_Департамент обеспечения производства' },
    { value: "'ДК_Дирекция качества'", label: "'ДК_Дирекция качества'" },
    { value: 'ДИСиТПП_Департамент "Инженерные системы и техническая поддержка пользователей"', label: 'ДИСиТПП_Департамент "Инженерные системы и техническая поддержка пользователей"' },
    { value: 'ДИИС_Департамент "Информационные инфраструктурные системы"', label: 'ДИИС_Департамент "Информационные инфраструктурные системы"' },
    { value: 'ДИБ_Департамент информационной безопасности', label: 'ДИБ_Департамент информационной безопасности' },
    { value: 'ДДС_Департамент дивизиональных  систем', label: 'ДДС_Департамент дивизиональных  систем' },
    { value: 'АУП_Административно-управленческий персонал', label: 'АУП_Административно-управленческий персонал' },
    { value: '"Балаковский"', label: '"Балаковский"' },
    { value: '"Волгодонский"', label: '"Волгодонский"' },
    { value: '"Калининский"', label: '"Калининский"' },
    { value: '"Кольский"', label: '"Кольский"' },
    { value: '"Курский"', label: '"Курский"' },
    { value: '"Ленинградский"', label: '"Ленинградский"' },
    { value: '"Нововоронежский"', label: '"Нововоронежский"' },
    { value: '"Смоленский"', label: '"Смоленский"' },
  ];

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: '#1f2937', // bg-gray-800
      borderColor: state.isFocused ? '#3b82f6' : '#4b5563', // focus blue-500 gray-600
      color: 'white',
      padding: '2px 4px',
      borderRadius: '0.375rem',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: '#3b82f6',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: 'white',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#1f2937', // bg-gray-800
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
        ? '#374151'
        : '#1f2937',
      color: 'white',
      cursor: 'pointer',
    }),
    input: (base) => ({
      ...base,
      color: 'white',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af',
    }),
  };

  const inputStyle = "block w-full mb-4 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className="p-6 pt-40 relative bg-gray-900 text-white min-h-screen">
      <a href="/">
        <img src={logo} alt="Rosatom Logo" className="absolute top-3 left-5 w-14" />
      </a>
      <h1 className="text-2xl mb-4 font-light">Введите данные</h1>
      <input name="name" placeholder="ФИО" value={userInfo.name} onChange={handleChange} className={inputStyle} />
      <input name="id" placeholder="Табельный номер" value={userInfo.id} onChange={handleChange} className={inputStyle} />

      <div className="mb-4">
        <Select
          options={departments}
          placeholder="Департамент"
          onChange={handleDepartmentChange}
          styles={customSelectStyles}
        />
      </div>

      <input name="rang" placeholder="Должность" value={userInfo.rang} onChange={handleChange} className={inputStyle} />
      <input name="perDay" placeholder="Посуточные" value={userInfo.perDay} onChange={handleChange} className={inputStyle} />

      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md transition-all"
      >
        Далее
      </button>
    </div>
  );
}

export default UserInfoPage;
