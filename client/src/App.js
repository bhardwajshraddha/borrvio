import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import AddItem from './pages/AddItem';
import ItemDetail from './pages/ItemDetail';
import OwnerDashboard from './pages/OwnerDashboard';
import RenterDashboard from './pages/RenterDashboard';
import BookingDetail from './pages/BookingDetail';
import Profile from './pages/Profile';

 
function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/renter-dashboard" element={<RenterDashboard />} />
        <Route path="/booking/:id" element={<BookingDetail />} />
      <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;