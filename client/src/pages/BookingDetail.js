import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiDownload, FiStar, FiArrowLeft } from "react-icons/fi";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState({ stars: 5, comment: "" });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchBooking = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/bookings/my",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const found = data.find((b) => b._id === id);
      setBooking(found);
    } catch (error) {
      toast.error("Booking not found!");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(
        "https://borrvio.onrender.com/api/payment/create-order",
        { bookingId: id },
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
                bookingId: id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );
            toast.success("Payment Successful!");
            fetchBooking();
          } catch (error) {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: "#f97316" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Payment failed!");
    }
  };

  const handleRating = async () => {
    try {
      await axios.post(
        "https://borrvio.onrender.com/api/ratings",
        {
          bookingId: id,
          toUserId: booking.owner._id,
          stars: rating.stars,
          comment: rating.comment,
          ratingType: "Renter-to-Owner",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Rating submitted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Rating failed!");
    }
  };

  const downloadAgreement = async () => {
    try {
      const { data } = await axios.get(
        `https://borrvio.onrender.com/api/agreements/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const link = document.createElement("a");
      link.href = data.pdfUrl;
      link.target = "_blank";
      link.download = `Borrvio-Agreement-${data.agreementId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Agreement not found!");
    }
  };

  if (loading)
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!booking)
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Booking not found!</p>
      </div>
    );

  return (
    <div className="gradient-bg min-h-screen text-white">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-5 glass border-b border-white/10">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold gradient-text cursor-pointer"
        >
          Borrvio
        </h1>
        <button
          onClick={() => navigate("/renter-dashboard")}
          className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl hover:border-orange-500/50 transition"
        >
          <FiArrowLeft /> Back
        </button>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 border border-white/10 mb-6"
        >
          <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
          <div className="flex flex-col gap-1">
            {[
              { label: "Item", value: booking.item?.name, highlight: true },
              { label: "Owner", value: booking.owner?.name },
              {
                label: "Start Date",
                value: new Date(booking.startDate).toDateString(),
              },
              {
                label: "End Date",
                value: new Date(booking.endDate).toDateString(),
              },
              { label: "Total Days", value: `${booking.totalDays} days` },
              {
                label: "Total Amount",
                value: `₹${booking.totalAmount}`,
                gradient: true,
              },
              { label: "Deposit", value: `₹${booking.depositAmount}` },
              { label: "Status", value: booking.status, orange: true },
              { label: "Deposit Status", value: booking.depositStatus },
            ].map((row, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
              >
                <span className="text-gray-400 text-sm">{row.label}</span>
                <span
                  className={`font-semibold text-sm ${row.gradient ? "gradient-text text-base" : row.orange ? "text-orange-400" : "text-white"}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Agreement Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 border border-orange-500/20 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center text-2xl">
              📄
            </div>
            <div>
              <h3 className="font-bold text-lg">Rental Agreement</h3>
              <p className="text-gray-400 text-sm">
                Auto-generated on booking acceptance
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 mb-5 border border-white/5">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400 text-sm">Item Name</span>
              <span className="text-white text-sm font-semibold">
                {booking.item?.name}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400 text-sm">Owner</span>
              <span className="text-white text-sm">{booking.owner?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400 text-sm">Renter</span>
              <span className="text-white text-sm">{user?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400 text-sm">Rental Period</span>
              <span className="text-white text-sm">
                {new Date(booking.startDate).toDateString()} →{" "}
                {new Date(booking.endDate).toDateString()}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400 text-sm">Total Days</span>
              <span className="text-white text-sm">
                {booking.totalDays} days
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-gray-400 text-sm">Rental Amount</span>
              <span className="gradient-text font-bold">
                ₹{booking.totalAmount}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400 text-sm">Security Deposit</span>
              <span className="text-white text-sm">
                ₹{booking.depositAmount}
              </span>
            </div>
          </div>

          <button
            onClick={downloadAgreement}
            className="w-full flex items-center justify-center gap-2 glass border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 py-3 rounded-xl transition font-semibold"
          >
            <FiDownload /> Download Rental Agreement PDF
          </button>
        </motion.div>

        {/* Payment Section */}
        {booking.status === "Accepted" && booking.paymentStatus !== "Paid" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl p-6 border border-green-500/20 mb-6"
          >
            <h3 className="font-bold text-lg mb-4">Complete Payment</h3>
            <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Rental Amount</span>
                <span className="text-white text-sm">
                  ₹{booking.totalAmount}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-gray-400 text-sm">Security Deposit</span>
                <span className="text-white text-sm">
                  ₹{booking.depositAmount}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-white/10">
                <span className="font-bold">Total Payable</span>
                <span className="gradient-text font-bold text-lg">
                  ₹{booking.totalAmount + booking.depositAmount}
                </span>
              </div>
            </div>
            <button
              onClick={handlePayment}
              className="w-full btn-gradient py-3 rounded-xl font-semibold text-lg glow-orange"
            >
              💳 Pay Now — ₹{booking.totalAmount + booking.depositAmount}
            </button>
          </motion.div>
        )}

        {/* Payment Done */}
        {booking.paymentStatus === "Paid" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-4 border border-green-500/20 mb-6 flex items-center gap-3"
          >
            <span className="text-3xl">✅</span>
            <div>
              <p className="text-green-400 font-bold">Payment Completed</p>
              <p className="text-gray-400 text-sm">
                Your rental is confirmed and active
              </p>
            </div>
          </motion.div>
        )}

        {/* Rating Section */}
        {booking.status === "Completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
              <FiStar className="text-yellow-400" /> Rate Your Experience
            </h3>

            <div className="mb-5">
              <label className="text-gray-400 text-sm mb-3 block">Stars</label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating({ ...rating, stars: star })}
                    className={`text-3xl transition-all ${star <= rating.stars ? "text-yellow-400 scale-110" : "text-gray-600"}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-gray-400 text-sm mb-2 block">
                Comment
              </label>
              <textarea
                value={rating.comment}
                onChange={(e) =>
                  setRating({ ...rating, comment: e.target.value })
                }
                placeholder="Share your experience..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow resize-none"
              />
            </div>

            <button
              onClick={handleRating}
              className="w-full btn-gradient py-3 rounded-xl font-semibold glow-orange"
            >
              Submit Rating
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingDetail;
