import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
} from "react-icons/fi";

const RenterDashboard = () => {
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
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        "https://borrvio-backend.onrender.com/api/dashboard/renter",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load dashboard!");
    }
  };

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        "https://borrvio-backend.onrender.com/api/bookings/my",
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
  const handlePayment = async (booking) => {
    try {
      const { data } = await axios.post(
        "https://borrvio-backend.onrender.com/api/payment/create-order",
        { bookingId: booking._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Borrvio",
        description: `Rental Payment — ${booking.item?.name}`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            await axios.post(
              "https://borrvio-backend.onrender.com/api/payment/verify",
              {
                bookingId: booking._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            toast.success("Payment Successful!");
            fetchBookings();
          } catch (error) {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Payment failed!");
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
            onClick={() => navigate("/owner-dashboard")}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:border-orange-500 transition"
          >
            Owner View
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold">Renter Dashboard</h2>
          <p className="text-gray-400 mt-1">Welcome, {user.name}!</p>
        </motion.div>

        {/* Stats */}
        {dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              {
                icon: <FiClock />,
                label: "Pending",
                value: dashboard.pendingBookings,
                color: "text-yellow-400",
              },
              {
                icon: <FiShoppingBag />,
                label: "Active",
                value: dashboard.activeBookings,
                color: "text-green-400",
              },
              {
                icon: <FiCheckCircle />,
                label: "Completed",
                value: dashboard.completedBookings,
                color: "text-blue-400",
              },
              {
                icon: <FiDollarSign />,
                label: "Total Spent",
                value: `₹${dashboard.totalSpent}`,
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
        <h3 className="text-xl font-bold mb-4">My Bookings</h3>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="bg-[#1a1a2e] rounded-2xl p-10 border border-gray-800 text-center">
            <p className="text-gray-400">No bookings yet!</p>
            <button
              onClick={() => navigate("/browse")}
              className="mt-4 px-6 py-2 bg-orange-500 rounded-xl hover:bg-orange-600 transition"
            >
              Browse Items
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
                      Owner:{" "}
                      <span className="text-white">{booking.owner?.name}</span>
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
                    </p>
                    <p className="text-gray-400 text-sm">
                      Deposit: ₹{booking.depositAmount}
                    </p>
                    {booking.status === "Accepted" &&
                      booking.paymentStatus !== "Paid" && (
                        <button
                          onClick={() => handlePayment(booking)}
                          className="mt-3 w-full bg-green-500 hover:bg-green-600 py-2 rounded-xl text-sm font-semibold transition"
                        >
                          💳 Pay Now — ₹
                          {booking.totalAmount + booking.depositAmount}
                        </button>
                      )}

                    {booking.paymentStatus === "Paid" && (
                      <p className="mt-3 text-center text-green-400 font-semibold">
                        ✅ Payment Done
                      </p>
                    )}
                  </div>
                  <span
                    className={`${statusColor(booking.status)} px-3 py-1 rounded-full text-sm font-semibold h-fit`}
                  >
                    {booking.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenterDashboard;
