import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUpload, FiX, FiArrowLeft } from "react-icons/fi";

const AddItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    pricePerDay: "",
    securityDeposit: "",
    city: "",
    area: "",
    address: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const formDataImg = new FormData();
    images.forEach((image) => formDataImg.append("image", image));
    const { data } = await axios.post(
      "https://borrvio.onrender.com/api/upload",
      formDataImg,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data.urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      let imageUrls = [];
      if (images.length > 0) {
        toast.loading("Uploading images...");
        imageUrls = await uploadImages();
        toast.dismiss();
      }
      await axios.post(
        "https://borrvio.onrender.com/api/items",
        {
          ...formData,
          pricePerDay: Number(formData.pricePerDay),
          securityDeposit: Number(formData.securityDeposit),
          images: imageUrls,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Item listed successfully!");
      navigate("/browse");
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to add item!");
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
          className="text-3xl font-bold gradient-text cursor-pointer"
        >
          Borrvio
        </h1>
        <button
          onClick={() => navigate("/browse")}
          className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl hover:border-orange-500/50 transition"
        >
          <FiArrowLeft /> Back to Browse
        </button>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass p-8 rounded-3xl border border-white/10"
        >
          <h2 className="text-3xl font-bold mb-2">List Your Item</h2>
          <p className="text-gray-400 mb-8">
            Fill in the details to list your item for rent
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Canon DSLR Camera"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-[#0d0d2b] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none input-glow transition-all"
                style={{ colorScheme: "dark" }}
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
                <option value="Jewellery">Jewellery</option>
                <option value="Other">Other</option>
              </select>
            </div>
    
            {/* Description */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your item..."
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all resize-none"
              />
            </div>

            {/* Price + Deposit */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-2 block">
                  Price Per Day (₹)
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-2 block">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all"
                />
              </div>
            </div>

            {/* City + Area */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-2 block">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Pune"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 text-sm mb-2 block">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g. Kothrud"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all"
                />
              </div>
            </div>

            {/* Pickup Address */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Pickup Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Shop 5, FC Road, Near XYZ Mall"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Upload Images
              </label>
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-orange-500/50 transition-all bg-white/5">
                <FiUpload className="text-gray-400 text-3xl mb-2" />
                <span className="text-gray-400 text-sm">
                  Click to upload images
                </span>
                <span className="text-gray-600 text-xs mt-1">
                  PNG, JPG up to 10MB
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {previews.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                  {previews.map((preview, i) => (
                    <div key={i} className="relative">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-xl border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <FiX size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-3 rounded-xl font-semibold text-lg mt-2 glow-orange"
            >
              {loading ? "Listing Item..." : "🚀 List Item"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddItem;
