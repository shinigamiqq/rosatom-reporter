import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import UserInfoPage from './components/UserInfoPage';
import TicketTypePage from './components/TicketTypePage';
import TicketUploadPage from './components/TicketUploadPage';
import HotelReceiptUploadPage from './components/HotelReceiptUploadPage';
import FinalPage from './components/FinalPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/user-info" element={<UserInfoPage />} />
        <Route path="/ticket-type" element={<TicketTypePage />} />
        <Route path="/ticket-upload" element={<TicketUploadPage />} />
        <Route path="/hotel-receipt-upload" element={<HotelReceiptUploadPage />} />
        <Route path="/final" element={<FinalPage />} />
      </Routes>
    </Router>
  );
}

export default App;

