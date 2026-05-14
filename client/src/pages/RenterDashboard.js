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

const RenterDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchDashboard = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/dashboard/renter",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDashboard(data);
    } catch (error) {
      toast.error("Failed to load dashboard!");
    }
  }, [token]);

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/bookings/my",
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
  }, [token, navigate, fetchDashboard, fetchBookings]);

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
        "https://borrvio.onrender.com/api/payment/create-order",
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
              "https://borrvio.onrender.com/api/payment/verify",
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
        prefill: { name: user.name, email: user.email },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Payment failed!");
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
            onClick={() => navigate("/owner-dashboard")}
            className="px-4 py-2 glass border border-white/10 rounded-xl hover:border-orange-500/50 transition"
          >
            Owner View
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold">Renter Dashboard</h2>
          <p className="text-gray-400 mt-2">
            Welcome,{" "}
            <span className="gradient-text font-semibold">{user.name}</span>!
          </p>
        </motion.div>

        {/* Stats */}
        {dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              {
                icon: <FiClock size={24} />,
                label: "Pending",
                value: dashboard.pendingBookings,
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
              },
              {
                icon: <FiShoppingBag size={24} />,
                label: "Active",
                value: dashboard.activeBookings,
                color: "text-green-400",
                bg: "bg-green-400/10",
              },
              {
                icon: <FiCheckCircle size={24} />,
                label: "Completed",
                value: dashboard.completedBookings,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
              {
                icon: <FiDollarSign size={24} />,
                label: "Total Spent",
                value: `₹${dashboard.totalSpent}`,
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
        <h3 className="text-2xl font-bold mb-6">My Bookings</h3>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass rounded-3xl p-10 border border-white/10 text-center">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-gray-400 mb-4">No bookings yet!</p>
            <button
              onClick={() => navigate("/browse")}
              className="px-6 py-2 btn-gradient rounded-xl glow-orange"
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
                transition={{ delay: i * 0.05 }}
                className="glass rounded-3xl p-5 border border-white/10 card-hover"
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">
                      {booking.item?.name}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Owner:{" "}
                      <span className="text-white">{booking.owner?.name}</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(booking.startDate).toDateString()} →{" "}
                      {new Date(booking.endDate).toDateString()}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Total:{" "}
                      <span className="gradient-text font-semibold">
                        ₹{booking.totalAmount}
                      </span>
                      <span className="text-gray-500 ml-2">
                        Deposit: ₹{booking.depositAmount}
                      </span>
                    </p>

                    {booking.status === "Accepted" &&
                      booking.paymentStatus !== "Paid" && (
                        <button
                          onClick={() => handlePayment(booking)}
                          className="mt-3 w-full bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 py-2 rounded-xl text-sm font-semibold transition"
                        >
                          💳 Pay Now — ₹
                          {booking.totalAmount + booking.depositAmount}
                        </button>
                      )}

                    {booking.paymentStatus === "Paid" && (
                      <p className="mt-3 text-center text-green-400 font-semibold text-sm">
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
