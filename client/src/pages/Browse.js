import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiMapPin, FiTag } from "react-icons/fi";

const Browse = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("https://borrvio-backend.onrender.com/api/items", {
        params: { search, category, city },
      });
      setItems(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, category, city]);

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
            onClick={() => navigate("/add-item")}
            className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            + List Item
          </button>
          <button
            onClick={() => navigate("/owner-dashboard")}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:border-orange-500 transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 border border-gray-700 rounded-lg hover:border-orange-500 transition"
          >
            Profile
          </button>
        </div>
      </nav>

      {/* Filters */}
      <div className="px-10 py-6 bg-[#13131f] border-b border-gray-800">
        <div className="flex flex-wrap gap-4 max-w-5xl mx-auto">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-2 flex-1 min-w-[200px]">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white outline-none w-full"
            />
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-2">
            <FiTag className="text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#0f0f1a] text-white outline-none cursor-pointer"
              style={{ colorScheme: "dark" }}
            >
              <option value="" className="bg-[#1a1a2e] text-white">
                All Categories
              </option>
              <option value="Electronics" className="bg-[#1a1a2e] text-white">
                Electronics
              </option>
              <option value="Vehicles" className="bg-[#1a1a2e] text-white">
                Vehicles
              </option>
              <option value="Clothing" className="bg-[#1a1a2e] text-white">
                Clothing
              </option>
              <option value="Sports" className="bg-[#1a1a2e] text-white">
                Sports
              </option>
              <option value="Other" className="bg-[#1a1a2e] text-white">
                Other
              </option>
            </select>
          </div>

          {/* City */}
          <div className="flex items-center gap-2 bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-2">
            <FiMapPin className="text-gray-400" />
            <input
              type="text"
              placeholder="City..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="bg-transparent text-white outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="px-10 py-10 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-400">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400">No items found!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/item/${item._id}`)}
                className="bg-[#1a1a2e] rounded-2xl border border-gray-800 hover:border-orange-500 transition cursor-pointer overflow-hidden"
              >
                {/* Image */}
                <div className="h-52 bg-[#0f0f1a] flex items-center justify-center overflow-hidden">
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
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-xs bg-orange-500 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-orange-500 font-bold text-lg">
                        ₹{item.pricePerDay}
                      </span>
                      <span className="text-gray-500 text-sm"> /day</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <FiMapPin size={12} />
                      {item.city}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
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
