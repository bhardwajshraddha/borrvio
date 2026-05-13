import { motion } from "framer-motion";
import { FiArrowRight, FiShield, FiStar, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="gradient-bg text-white overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500 rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500 rounded-full opacity-5 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full opacity-5 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-5 glass border-b border-white/10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold gradient-text cursor-pointer"
          onClick={() => navigate("/")}
        >
          Borrvio
        </motion.h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-gray-300 hover:text-white border border-white/20 rounded-xl hover:border-orange-500/50 transition-all duration-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2 btn-gradient rounded-xl font-semibold glow-orange"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500"></div>
            <span className="text-sm font-medium tracking-[0.3em] text-orange-400 uppercase">
              Peer · to · Peer · Rental · Plateform
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500"></div>
          </div>

          <h1 className="text-7xl font-extrabold mb-4 leading-tight">
            <span className="gradient-text">Borrvio</span>
          </h1>

          <p className="text-xl text-gray-400 mb-3 tracking-widest uppercase font-light">
            Rent Anything · From Anyone · Near You
          </p>

          <p className="text-gray-500 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
            Why buy when you can borrow? List your idle items or rent what you
            need — cameras, bikes, dresses, laptops and more. Secure, trusted,
            simple.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex gap-4 mt-12 flex-wrap justify-center"
        >
          <button
            onClick={() => navigate("/browse")}
            className="flex items-center gap-2 px-8 py-4 btn-gradient rounded-2xl font-semibold text-lg glow-orange"
          >
            Start Renting <FiArrowRight />
          </button>
          <button
            onClick={() => navigate("/register")}
            className="flex items-center gap-2 px-8 py-4 glass border border-orange-500/30 text-orange-400 rounded-2xl font-semibold text-lg hover:border-orange-500 transition-all duration-300"
          >
            List Your Item
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-10 mt-16 flex-wrap justify-center"
        >
          {[
            { value: "100%", label: "Secure Payments" },
            { value: "P2P", label: "Direct Rentals" },
            { value: "5★", label: "Rating System" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Why <span className="gradient-text">Borrvio?</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Built with trust, security, and simplicity in mind
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: <FiPackage size={28} />,
              title: "Rent Anything",
              desc: "Cameras, bikes, dresses, laptops — anything you need, find it near you.",
              color: "text-orange-400",
            },
            {
              icon: <FiShield size={28} />,
              title: "Trust Score",
              desc: "Every user has a dynamic trust score — rent with complete confidence.",
              color: "text-pink-400",
            },
            {
              icon: <FiStar size={28} />,
              title: "Rental Agreement",
              desc: "Auto-generated PDF agreement for every booking — legally traceable.",
              color: "text-purple-400",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="glass p-8 rounded-3xl card-hover border border-white/10"
            >
              <div className={`${feature.color} mb-5`}>{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-10 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass max-w-3xl mx-auto p-12 rounded-3xl border border-orange-500/20"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to <span className="gradient-text">Rent?</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Join Borrvio today and start renting anything from anyone near you!
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 btn-gradient rounded-2xl font-semibold text-lg glow-orange"
          >
            Get Started — It's Free!
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-gray-600 border-t border-white/5">
        © 2026 Borrvio — Rent Anything, From Anyone, Near You
      </footer>
    </div>
  );
};

export default Home;
