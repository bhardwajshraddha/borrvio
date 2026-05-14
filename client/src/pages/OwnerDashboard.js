import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiPlus,
  FiUser,
} from "react-icons/fi";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchDashboard = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/dashboard/owner",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load dashboard!");
    }
  }, [token]);

  const fetchMyItems = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/items",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMyItems(data.filter((item) => item.owner._id === user._id));
    } catch (error) {
      console.error(error);
    }
  }, [token, user._id]);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/bookings/owner",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboard();
    fetchBookings();
    fetchMyItems();
  }, [token, navigate, fetchDashboard, fetchBookings, fetchMyItems]);

  const deleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`https://borrvio.onrender.com/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Item deleted!");
      fetchMyItems();
      fetchDashboard();
    } catch (error) {
      toast.error("Failed to delete item!");
    }
  };

  const toggleItem = async (itemId) => {
    try {
      const { data } = await axios.patch(
        `https://borrvio.onrender.com/api/items/${itemId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(data.message);
      fetchMyItems();
    } catch (error) {
      toast.error("Failed to update item!");
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `https://borrvio.onrender.com/api/bookings/${bookingId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(`Booking ${status}!`);
      fetchBookings();
      fetchDashboard();
    } catch (error) {
      toast.error("Failed to update status!");
    }
  };

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
      {/* Background Orbs */}
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
          <button
            onClick={() => navigate("/browse")}
            className="px-4 py-2 glass border border-white/10 rounded-xl hover:border-orange-500/50 transition"
          >
            Browse
          </button>
          <button
            onClick={() => navigate("/add-item")}
            className="flex items-center gap-2 px-4 py-2 btn-gradient rounded-xl font-semibold glow-orange"
          >
            <FiPlus /> List Item
          </button>
          <button
            onClick={() => navigate("/renter-dashboard")}
            className="px-4 py-2 glass border border-white/10 rounded-xl hover:border-orange-500/50 transition"
          >
            Renter View
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl hover:border-orange-500/50 transition"
          >
            <FiUser /> Profile
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold">Owner Dashboard</h2>
          <p className="text-gray-400 mt-2">
            Welcome back,{" "}
            <span className="gradient-text font-semibold">{user.name}</span>!
          </p>
        </motion.div>

        {/* Stats */}
        {dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              {
                icon: <FiDollarSign size={24} />,
                label: "Total Earnings",
                value: `₹${dashboard.totalEarnings}`,
                color: "text-green-400",
                bg: "bg-green-400/10",
              },
              {
                icon: <FiPackage size={24} />,
                label: "Total Items",
                value: dashboard.totalItems,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                icon: <FiClock size={24} />,
                label: "Pending",
                value: dashboard.pendingRequests,
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
              },
              {
                icon: <FiCheckCircle size={24} />,
                label: "Completed",
                value: dashboard.completedRentals,
                color: "text-orange-400",
                bg: "bg-orange-400/10",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl p-5 border border-white/10"
              >
                <div
                  className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-3`}
                >
                  {stat.icon}
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bookings */}
        <h3 className="text-2xl font-bold mb-6">Booking Requests</h3>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass rounded-3xl p-10 border border-white/10 text-center mb-10">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 mb-4">No bookings yet!</p>
            <button
              onClick={() => navigate("/add-item")}
              className="px-6 py-2 btn-gradient rounded-xl glow-orange"
            >
              List Your First Item
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-10">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-3xl p-5 border border-white/10 card-hover"
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {booking.item?.name}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Renter:{" "}
                      <span className="text-white">{booking.renter?.name}</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(booking.startDate).toDateString()} →{" "}
                      {new Date(booking.endDate).toDateString()}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      <span className="gradient-text font-semibold">
                        ₹{booking.totalAmount}
                      </span>
                      <span className="ml-2 text-gray-500">
                        + ₹{booking.depositAmount} deposit
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`${statusColor(booking.status)} px-3 py-1 rounded-full text-sm font-semibold`}
                    >
                      {booking.status}
                    </span>
                    {booking.status === "Requested" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(booking._id, "Accepted")}
                          className="px-4 py-1 bg-green-500 hover:bg-green-600 rounded-xl text-sm transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(booking._id, "Cancelled")}
                          className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded-xl text-sm transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {booking.status === "Accepted" && (
                      <button
                        onClick={() => updateStatus(booking._id, "Active")}
                        className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded-xl text-sm transition"
                      >
                        Mark Active
                      </button>
                    )}
                    {booking.status === "Active" && (
                      <button
                        onClick={() => updateStatus(booking._id, "Completed")}
                        className="px-4 py-1 bg-gray-500 hover:bg-gray-600 rounded-xl text-sm transition"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* My Items */}
        <h3 className="text-2xl font-bold mb-6">My Listed Items</h3>
        {myItems.length === 0 ? (
          <div className="glass rounded-3xl p-10 border border-white/10 text-center">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-400 mb-4">No items listed yet!</p>
            <button
              onClick={() => navigate("/add-item")}
              className="px-6 py-2 btn-gradient rounded-xl glow-orange"
            >
              List Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl border border-white/10 overflow-hidden card-hover"
              >
                <div className="h-40 bg-white/5 flex items-center justify-center">
                  {item.images?.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${item.isAvailable ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {item.isAvailable ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="gradient-text font-bold mb-3">
                    ₹{item.pricePerDay}/day
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleItem(item._id)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${item.isAvailable ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30" : "bg-green-500/20 text-green-400 hover:bg-green-500/30"}`}
                    >
                      {item.isAvailable ? "⏸ Deactivate" : "▶ Activate"}
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="flex-1 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-sm font-semibold transition"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
