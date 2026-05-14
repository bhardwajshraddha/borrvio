import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiMapPin, FiTag, FiPlus, FiUser } from "react-icons/fi";

const Browse = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("borrvio.onrender.com/api/items", {
        params: { search, category, city },
      });
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, category, city]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
            onClick={() => navigate("/add-item")}
            className="flex items-center gap-2 px-4 py-2 btn-gradient rounded-xl font-semibold glow-orange"
          >
            <FiPlus /> List Item
          </button>
          <button
            onClick={() => navigate("/owner-dashboard")}
            className="px-4 py-2 glass border border-white/10 rounded-xl hover:border-orange-500/50 transition"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl hover:border-orange-500/50 transition"
          >
            <FiUser /> Profile
          </button>
        </div>
      </nav>

      {/* Filters */}
      <div className="relative z-10 px-10 py-6 glass border-b border-white/5">
        <div className="flex flex-wrap gap-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex-1 min-w-[200px] focus-within:border-orange-500/50 transition">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-transparent text-white outline-none w-full placeholder-gray-600"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-orange-500/50 transition">
            <FiTag className="text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer"
              style={{ colorScheme: "dark" }}
            >
              <option value="" className="bg-[#0d0d2b]">
                All Categories
              </option>
              <option value="Electronics" className="bg-[#0d0d2b]">
                Electronics
              </option>
              <option value="Vehicles" className="bg-[#0d0d2b]">
                Vehicles
              </option>
              <option value="Clothing" className="bg-[#0d0d2b]">
                Clothing
              </option>
              <option value="Sports" className="bg-[#0d0d2b]">
                Sports
              </option>
              <option value="Tools" className="bg-[#0d0d2b]">
                Tools
              </option>
              <option value="Furniture" className="bg-[#0d0d2b]">
                Furniture
              </option>
              <option value="Jewellery" className="bg-[#0d0d2b]">
                Jewellery
              </option>
              <option value="Other" className="bg-[#0d0d2b]">
                Other
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-orange-500/50 transition">
            <FiMapPin className="text-gray-400" />
            <input
              type="text"
              placeholder="City..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-white outline-none placeholder-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="relative z-10 px-10 py-10 max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-gray-400 text-lg">No items found!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/item/${item._id}`)}
                className="glass rounded-3xl border border-white/10 card-hover cursor-pointer overflow-hidden"
              >
                {/* Image */}
                <div className="h-52 bg-white/5 flex items-center justify-center overflow-hidden">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-5xl">📦</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-xs btn-gradient px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="gradient-text font-bold text-xl">
                        ₹{item.pricePerDay}
                      </span>
                      <span className="text-gray-500 text-sm"> /day</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <FiMapPin size={12} />
                      {item.city}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-600">
                    Deposit: ₹{item.securityDeposit}
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

export default Browse;
