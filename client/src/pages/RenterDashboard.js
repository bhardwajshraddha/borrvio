import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const RenterDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ DASHBOARD
  const fetchDashboard = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/dashboard/renter",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load dashboard!");
    }
  }, [token]);

  // ✅ BOOKINGS
  const fetchBookings = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/bookings/my",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ FIXED WISHLIST FUNCTION (IMPORTANT FIX)
  const fetchWishlist = useCallback(async () => {
    if (!token) return;

    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/wishlist",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setWishlist(data);
    } catch (error) {
      // 👇 401 will NOT break UI anymore
      console.log("Wishlist fetch skipped or unauthorized");
    }
  }, [token]);

  // ✅ INIT
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboard();
    fetchBookings();
    fetchWishlist();
  }, [token, navigate, fetchDashboard, fetchBookings, fetchWishlist]);

  const statusColor = (status) => {
    switch (status) {
      case "Requested":
        return "bg-yellow-500";
      case "Accepted":
        return "bg-blue-500";
      case "Active":
        return "bg-green-500";
      case "Completed":
        return "bg-gray-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="gradient-bg min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-5 glass border-b border-white/10">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold gradient-text cursor-pointer"
        >
          Borrvio
        </h1>

        <div className="flex gap-3">
          <button onClick={() => navigate("/browse")}>Browse</button>
          <button onClick={() => navigate("/owner-dashboard")}>
            Owner View
          </button>
          <button onClick={() => navigate("/profile")}>
            <FiUser /> Profile
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-4xl font-bold">Renter Dashboard</h2>
          <p className="text-gray-400 mt-2">
            Welcome, <span className="gradient-text">{user.name}</span>
          </p>
        </motion.div>

        {/* BOOKINGS */}
        <h3 className="text-2xl font-bold mt-8 mb-4">My Bookings</h3>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-400">No bookings yet</p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-4 glass rounded-xl mb-3 border border-white/10"
            >
              <h4 className="font-semibold">{booking.item?.name}</h4>

              <p className="text-sm text-gray-400">
                {new Date(booking.startDate).toDateString()} →{" "}
                {new Date(booking.endDate).toDateString()}
              </p>

              <span
                className={`${statusColor(
                  booking.status,
                )} px-2 py-1 text-xs rounded`}
              >
                {booking.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RenterDashboard;
