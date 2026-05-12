import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUser, FiPhone, FiMapPin, FiStar, FiShield } from "react-icons/fi";

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    area: "",
  });
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ FIX: Wrapped in useCallback so it can be safely added to useEffect deps
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(
        "https://borrvio.onrender.com/api/auth/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUserInfo(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        city: data.city || "",
        area: data.area || "",
      });
    } catch (error) {
      toast.error("Failed to load profile!");
    }
  }, [token]);

  // ✅ FIX: Added all missing dependencies — fetchProfile, navigate, token
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token, navigate, fetchProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        "https://borrvio.onrender.com/api/auth/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      localStorage.setItem("user", JSON.stringify({ ...user, ...data }));
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile!");
    } finally {
      setLoading(false);
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
            Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Profile Header */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1a1a2e] rounded-2xl p-6 border border-gray-800 mb-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-2xl font-bold">
                {userInfo.name?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                <p className="text-gray-400">{userInfo.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-[#0f0f1a] rounded-xl p-3 text-center">
                <FiShield className="text-orange-500 mx-auto mb-1" size={20} />
                <p className="text-orange-500 font-bold">
                  {userInfo.trustScore}%
                </p>
                <p className="text-gray-400 text-xs">Trust Score</p>
              </div>
              <div className="bg-[#0f0f1a] rounded-xl p-3 text-center">
                <FiStar className="text-yellow-400 mx-auto mb-1" size={20} />
                <p className="text-yellow-400 font-bold">
                  {userInfo.averageRating || "New"}
                </p>
                <p className="text-gray-400 text-xs">Rating</p>
              </div>
              <div className="bg-[#0f0f1a] rounded-xl p-3 text-center">
                <FiUser className="text-blue-400 mx-auto mb-1" size={20} />
                <p className="text-blue-400 font-bold">
                  {userInfo.totalRentalsAsRenter || 0}
                </p>
                <p className="text-gray-400 text-xs">Rentals</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1a1a2e] rounded-2xl p-6 border border-gray-800"
        >
          <h3 className="text-xl font-bold mb-6">Edit Profile</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                <FiUser className="inline mr-1" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                <FiPhone className="inline mr-1" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-1 block">
                  <FiMapPin className="inline mr-1" /> City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-1 block">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition mt-2"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </motion.div>

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
            toast.success("Logged out!");
          }}
          className="w-full mt-4 py-3 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
