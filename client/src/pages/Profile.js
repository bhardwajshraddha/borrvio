import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiStar,
  FiShield,
  FiLogOut,
} from "react-icons/fi";

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [token, navigate, fetchProfile]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
            Dashboard
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        {/* Profile Header */}
        {userInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 border border-white/10 mb-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 btn-gradient rounded-full flex items-center justify-center text-2xl font-bold glow-orange">
                {userInfo.name?.[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userInfo.name}</h2>
                <p className="text-gray-400">{userInfo.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: <FiShield size={20} />,
                  value: `${userInfo.trustScore}%`,
                  label: "Trust Score",
                  color: "text-orange-400",
                },
                {
                  icon: <FiStar size={20} />,
                  value: userInfo.averageRating || "New",
                  label: "Rating",
                  color: "text-yellow-400",
                },
                {
                  icon: <FiUser size={20} />,
                  value: userInfo.totalRentalsAsRenter || 0,
                  label: "Rentals",
                  color: "text-blue-400",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-2xl p-4 text-center border border-white/5"
                >
                  <div className={`${stat.color} flex justify-center mb-2`}>
                    {stat.icon}
                  </div>
                  <p className={`${stat.color} font-bold text-lg`}>
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold mb-6">Edit Profile</h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block flex items-center gap-1">
                <FiUser size={12} /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none input-glow transition-all"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block flex items-center gap-1">
                <FiPhone size={12} /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-2 block flex items-center gap-1">
                  <FiMapPin size={12} /> City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none input-glow transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-2 block">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none input-glow transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-3 rounded-xl font-semibold text-lg mt-2 glow-orange"
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
          className="w-full mt-4 py-3 glass border border-red-500/30 text-red-400 rounded-2xl hover:bg-red-500/10 transition font-semibold flex items-center justify-center gap-2"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
