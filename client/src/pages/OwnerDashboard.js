import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiPackage,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboard();
    fetchBookings();
    fetchMyItems();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/dashboard/owner",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load dashboard!");
    }
  };
  const [myItems, setMyItems] = useState([]);

  const fetchMyItems = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ownerItems = data.filter((item) => item.owner._id === user._id);
      setMyItems(ownerItems);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/bookings/owner",
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
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
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
        `http://localhost:5000/api/items/${itemId}/toggle`,
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
        `http://localhost:5000/api/bookings/${bookingId}`,
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
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-orange-500 cursor-pointer"
        >
          Borrvio
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/browse")}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:border-orange-500 transition"
          >
            Browse
          </button>
          <button
            onClick={() => navigate("/add-item")}
            className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            + List Item
          </button>
          <button
            onClick={() => navigate("/renter-dashboard")}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:border-orange-500 transition"
          >
            Renter View
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:border-orange-500 transition"
          >
            Profile
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold">Owner Dashboard</h2>
          <p className="text-gray-400 mt-1">Welcome back, {user.name}!</p>
        </motion.div>

        {/* Stats */}
        {dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              {
                icon: <FiDollarSign />,
                label: "Total Earnings",
                value: `₹${dashboard.totalEarnings}`,
                color: "text-green-400",
              },
              {
                icon: <FiPackage />,
                label: "Total Items",
                value: dashboard.totalItems,
                color: "text-blue-400",
              },
              {
                icon: <FiClock />,
                label: "Pending Requests",
                value: dashboard.pendingRequests,
                color: "text-yellow-400",
              },
              {
                icon: <FiCheckCircle />,
                label: "Completed",
                value: dashboard.completedRentals,
                color: "text-orange-400",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1a1a2e] rounded-2xl p-5 border border-gray-800"
              >
                <div className={`text-2xl mb-2 ${stat.color}`}>{stat.icon}</div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bookings */}
        <h3 className="text-xl font-bold mb-4">Booking Requests</h3>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-[#1a1a2e] rounded-2xl p-10 border border-gray-800 text-center">
            <p className="text-gray-400">No bookings yet!</p>
            <button
              onClick={() => navigate("/add-item")}
              className="mt-4 px-6 py-2 bg-orange-500 rounded-xl hover:bg-orange-600 transition"
            >
              List Your First Item
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking, i) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#1a1a2e] rounded-2xl p-5 border border-gray-800"
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
                      Dates: {new Date(booking.startDate).toDateString()} →{" "}
                      {new Date(booking.endDate).toDateString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Total:{" "}
                      <span className="text-orange-500 font-semibold">
                        ₹{booking.totalAmount}
                      </span>
                      <span className="ml-2">
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
                          className="px-4 py-1 bg-green-500 hover:bg-green-600 rounded-lg text-sm transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(booking._id, "Cancelled")}
                          className="px-4 py-1 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {booking.status === "Accepted" && (
                      <button
                        onClick={() => updateStatus(booking._id, "Active")}
                        className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition"
                      >
                        Mark Active
                      </button>
                    )}

                    {booking.status === "Active" && (
                      <button
                        onClick={() => updateStatus(booking._id, "Completed")}
                        className="px-4 py-1 bg-gray-500 hover:bg-gray-600 rounded-lg text-sm transition"
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
        <h3 className="text-xl font-bold mb-4 mt-10">My Listed Items</h3>
        {myItems.length === 0 ? (
          <div className="bg-[#1a1a2e] rounded-2xl p-10 border border-gray-800 text-center">
            <p className="text-gray-400">No items listed yet!</p>
            <button
              onClick={() => navigate("/add-item")}
              className="mt-4 px-6 py-2 bg-orange-500 rounded-xl hover:bg-orange-600 transition"
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
                className="bg-[#1a1a2e] rounded-2xl border border-gray-800 overflow-hidden"
              >
                {/* Image */}
                <div className="h-40 bg-[#0f0f1a] flex items-center justify-center">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-4xl">📦</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{item.name}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${item.isAvailable ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {item.isAvailable ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-orange-500 font-bold mb-3">
                    ₹{item.pricePerDay}/day
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleItem(item._id)}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${
                        item.isAvailable
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {item.isAvailable ? "⏸ Deactivate" : "▶ Activate"}
                    </button>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold transition"
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
