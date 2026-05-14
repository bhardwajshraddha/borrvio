import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiMapPin,
  FiShield,
  FiCalendar,
  FiArrowLeft,
  FiStar,
} from "react-icons/fi";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [booking, setBooking] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(
          `https://borrvio.onrender.com/api/items/${id}`,
        );
        setItem(data);
      } catch (error) {
        toast.error("Item not found!");
        navigate("/browse");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24),
    );
  };

  const handleBooking = async () => {
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select dates!");
      return;
    }
    if (calculateDays() <= 0) {
      toast.error("End date must be after start date!");
      return;
    }
    setBooking(true);
    try {
      await axios.post(
        "https://borrvio.onrender.com/api/bookings",
        { itemId: id, startDate, endDate },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Booking request sent!");
      navigate("/renter-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed!");
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const days = calculateDays();
  const totalAmount = days * (item?.pricePerDay || 0);

  return (
    <div className="gradient-bg min-h-screen text-white">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-4xl flex items-center justify-center px-4"
            onMouseDown={(e) => setStartX(e.clientX)}
            onMouseUp={(e) => {
              const diff = e.clientX - startX;
              if (diff > 50 && imageIndex > 0) {
                const newIndex = imageIndex - 1;
                setImageIndex(newIndex);
                setSelectedImage(item.images[newIndex]);
              }
              if (diff < -50 && imageIndex < item.images.length - 1) {
                const newIndex = imageIndex + 1;
                setImageIndex(newIndex);
                setSelectedImage(item.images[newIndex]);
              }
            }}
          >
            <img
              src={selectedImage}
              alt="gallery"
              className="max-h-[80vh] max-w-full object-contain rounded-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 glass w-10 h-10 rounded-full text-white border border-white/20"
            >
              ✕
            </button>
            <div className="absolute bottom-5 flex gap-2">
              {item?.images?.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${i === imageIndex ? "bg-orange-500 w-4" : "bg-gray-500"}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-5 glass border-b border-white/10">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold gradient-text cursor-pointer"
        >
          Borrvio
        </h1>
        <button
          onClick={() => navigate("/browse")}
          className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl hover:border-orange-500/50 transition"
        >
          <FiArrowLeft /> Browse
        </button>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Main Image */}
            <div
              className="glass rounded-3xl h-80 flex items-center justify-center border border-white/10 cursor-pointer overflow-hidden"
              onClick={() => {
                setImageIndex(0);
                setSelectedImage(item?.images?.[0]);
              }}
            >
              {item?.images?.length > 0 ? (
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <span className="text-8xl">📦</span>
              )}
            </div>

            {/* Thumbnails */}
            {item?.images?.length > 1 && (
              <div className="flex gap-3 mt-3 overflow-x-auto">
                {item.images.slice(1).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="preview"
                    onClick={() => {
                      setImageIndex(index + 1);
                      setSelectedImage(item.images[index + 1]);
                    }}
                    className="w-20 h-20 object-cover rounded-xl border border-white/10 cursor-pointer hover:border-orange-500 transition"
                  />
                ))}
              </div>
            )}

            {/* Owner Info */}
            <div className="glass rounded-3xl p-4 mt-4 border border-white/10">
              <p className="text-gray-400 text-sm mb-3">Listed by</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 btn-gradient rounded-full flex items-center justify-center font-bold text-lg">
                  {item?.owner?.name?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold">{item?.owner?.name}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-yellow-400 flex items-center gap-1">
                      <FiStar size={12} /> {item?.owner?.averageRating || "New"}
                    </span>
                    <span className="text-gray-500">
                      Trust: {item?.owner?.trustScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="glass rounded-3xl p-4 mt-4 border border-white/10">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiMapPin className="text-orange-500" /> Pickup Location
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                {item?.address || `${item?.area || ""}, ${item?.city || ""}`}
              </p>
              <iframe
                title="map"
                width="100%"
                height="180"
                frameBorder="0"
                style={{ borderRadius: "12px" }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(item?.address || `${item?.area} ${item?.city}`)}&output=embed`}
              />
            </div>

            {/* Contact Owner */}
            <div className="glass rounded-3xl p-4 mt-4 border border-white/10">
              <h3 className="font-semibold mb-3">Contact Owner</h3>
              {item?.owner?.phone ? (
                <a
                  href={`tel:${item.owner.phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 py-3 rounded-xl font-semibold transition"
                >
                  📞 Call Owner
                </a>
              ) : (
                <p className="text-gray-500 text-sm">
                  Contact info not available
                </p>
              )}
              {item?.owner?.phone && (
                <a
                  href={`https://wa.me/91${item.owner.phone}?text=${encodeURIComponent(`Hi! I'm interested in renting your ${item.name} on Borrvio.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/30 py-3 rounded-xl font-semibold transition mt-3"
                >
                  💬 WhatsApp Owner
                </a>
              )}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex justify-between items-start mb-3">
              <h1 className="text-3xl font-bold">{item?.name}</h1>
              <span className="btn-gradient px-3 py-1 rounded-full text-sm">
                {item?.category}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <FiMapPin size={14} />
              <span>
                {item?.city}, {item?.area}
              </span>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              {item?.description}
            </p>

            {/* Pricing */}
            <div className="glass rounded-3xl p-5 border border-white/10 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Price per day</span>
                <span className="gradient-text font-bold text-2xl">
                  ₹{item?.pricePerDay}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-gray-400 flex items-center gap-2">
                  <FiShield size={14} className="text-orange-500" /> Security
                  Deposit
                </span>
                <span className="text-white font-semibold">
                  ₹{item?.securityDeposit}
                </span>
              </div>
            </div>

            {/* Booking */}
            <div className="glass rounded-3xl p-5 border border-white/10">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FiCalendar className="text-orange-500" /> Select Dates
              </h3>
              <div className="flex gap-3 mb-4">
                <div className="flex-1">
                  <label className="text-gray-400 text-sm mb-2 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none input-glow"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-sm mb-2 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split("T")[0]}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none input-glow"
                  />
                </div>
              </div>

              {days > 0 && (
                <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>
                      ₹{item?.pricePerDay} × {days} days
                    </span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mb-3">
                    <span>Security Deposit</span>
                    <span>₹{item?.securityDeposit}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-white/10 pt-3">
                    <span>Total</span>
                    <span className="gradient-text text-lg">
                      ₹{totalAmount + (item?.securityDeposit || 0)}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={booking}
                className="w-full btn-gradient py-3 rounded-xl font-semibold text-lg glow-orange"
              >
                {booking ? "Sending Request..." : "🚀 Request to Rent"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
