import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
// ✅ FIX: Removed unused imports — FiMapPin, FiStar, FiShield, FiCalendar

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ LIGHTBOX STATE
  const [selectedImage, setSelectedImage] = useState(null);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [booking, setBooking] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  // ✅ FIX: Removed unused 'isDragging' state variable
  const [startX, setStartX] = useState(0);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(
          `https://borrvio-backend.onrender.com/api/items/${id}`,
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
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
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
        "https://borrvio-backend.onrender.com/api/bookings",
        {
          itemId: id,
          startDate,
          endDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Booking request sent!");
      navigate("/renter-dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed!");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const days = calculateDays();
  const totalAmount = days * (item?.pricePerDay || 0);

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* 🔥 LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          {/* IMAGE CONTAINER */}
          <div
            className="relative w-full max-w-4xl flex items-center justify-center"
            onMouseDown={(e) => {
              setStartX(e.clientX);
            }}
            onMouseUp={(e) => {
              const diff = e.clientX - startX;

              if (diff > 50 && imageIndex > 0) {
                // swipe right → previous
                const newIndex = imageIndex - 1;
                setImageIndex(newIndex);
                setSelectedImage(item.images[newIndex]);
              }

              if (diff < -50 && imageIndex < item.images.length - 1) {
                // swipe left → next
                const newIndex = imageIndex + 1;
                setImageIndex(newIndex);
                setSelectedImage(item.images[newIndex]);
              }
            }}
          >
            <img
              src={selectedImage}
              alt="gallery"
              className="max-h-[80vh] max-w-full object-contain rounded-xl transition-all duration-300"
            />

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white w-10 h-10 rounded-full"
            >
              ✕
            </button>

            {/* NAV DOTS */}
            <div className="absolute bottom-5 flex gap-2">
              {item?.images?.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === imageIndex ? "bg-orange-500" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-orange-500 cursor-pointer"
        >
          Borrvio
        </h1>

        <button
          onClick={() => navigate("/browse")}
          className="px-4 py-2 border border-gray-700 rounded-lg"
        >
          Back
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT SIDE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* MAIN IMAGE */}
          <div
            className="bg-[#1a1a2e] rounded-2xl h-80 flex items-center justify-center border border-gray-800 cursor-pointer overflow-hidden"
            onClick={() => {
              setImageIndex(0);
              setSelectedImage(item?.images?.[0]);

              if (window.innerWidth <= 768) {
                document.body.style.overflow = "hidden";
              }
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

          {/* THUMBNAILS */}
          {item?.images?.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto">
              {item.images.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => {
                    setImageIndex(index + 1);
                    setSelectedImage(item.images[index + 1]);
                  }}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-700 cursor-pointer hover:border-orange-500"
                  alt="preview"
                />
              ))}
            </div>
          )}

          {/* OWNER */}
          <div className="bg-[#1a1a2e] rounded-2xl p-4 mt-4 border border-gray-800">
            <p className="text-gray-400 text-sm mb-2">Listed by</p>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                {item?.owner?.name?.[0] || "U"}
              </div>

              <div>
                <p className="font-semibold">{item?.owner?.name}</p>
                <p className="text-sm text-gray-400">
                  ⭐ {item?.owner?.averageRating || "New"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold">{item?.name}</h1>

          <p className="text-gray-400 mt-2">{item?.description}</p>

          <div className="mt-4 text-orange-500 font-bold text-xl">
            ₹{item?.pricePerDay} / day
          </div>

          {/* DATES */}
          <div className="mt-6 space-y-3">
            <input
              type="date"
              className="w-full p-2 bg-[#1a1a2e] border border-gray-700 rounded-lg"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type="date"
              className="w-full p-2 bg-[#1a1a2e] border border-gray-700 rounded-lg"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* TOTAL */}
          {days > 0 && (
            <div className="mt-4 text-gray-300">Total: ₹{totalAmount}</div>
          )}

          {/* BOOK BUTTON */}
          <button
            onClick={handleBooking}
            disabled={booking}
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold"
          >
            {booking ? "Booking..." : "Request to Rent"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ItemDetail;
