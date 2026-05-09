import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-orange-500"
        >
          Borrvio
        </motion.h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-gray-300 hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-extrabold mb-4">
            <span className="text-orange-500">Borrvio</span>
          </h1>
          <p className="text-xl text-gray-400 mb-2 tracking-widest uppercase">
            Rent Anything, From Anyone, Near You
          </p>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            Why buy when you can borrow? List your items or rent from people
            around you — cameras, bikes, dresses, laptops and more.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex gap-4 mt-10"
        >
          <button
            onClick={() => navigate("/browse")}
            className="flex items-center gap-2 px-8 py-3 bg-orange-500 rounded-xl font-semibold text-lg hover:bg-orange-600 transition"
          >
            Start Renting <FiArrowRight />
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 px-8 py-3 border border-orange-500 text-orange-500 rounded-xl font-semibold text-lg hover:bg-orange-500 hover:text-white transition"
          >
            List Your Item
          </button>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="px-10 py-16 bg-[#13131f]">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why <span className="text-orange-500">Borrvio?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: "📦",
              title: "Rent Anything",
              desc: "Cameras, bikes, dresses, laptops — anything you need, find it near you.",
            },
            {
              icon: "🛡️",
              title: "Trust Score",
              desc: "Every user has a trust score — rent with confidence and safety.",
            },
            {
              icon: "📄",
              title: "Rental Agreement",
              desc: "Auto-generated PDF agreement for every booking — legally traceable.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-[#1a1a2e] p-6 rounded-2xl border border-gray-800 hover:border-orange-500 transition"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 border-t border-gray-800">
        © 2026 Borrvio — Rent Anything, From Anyone, Near You
      </footer>
    </div>
  );
};

export default Home;
