import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://borrvio.onrender.com/api/auth/forgot-password",
        { email },
      );
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "No account found with this email!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center px-4">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass w-full max-w-md p-8 rounded-3xl border border-white/10 relative z-10"
      >
        {!sent ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold gradient-text mb-2">
                Borrvio
              </h1>
              <h2 className="text-xl font-bold text-white mt-4">
                Forgot Password?
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                Enter your email — we'll send you a reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none input-glow transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient py-3 rounded-xl font-semibold text-lg mt-2 glow-orange"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-6">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Check Your Email!
            </h2>
            <p className="text-gray-400 mb-2">
              We sent a password reset link to:
            </p>
            <p className="gradient-text font-semibold text-lg mb-6">{email}</p>
            <p className="text-gray-500 text-sm mb-6">
              Link expires in{" "}
              <span className="text-orange-400">30 minutes</span>. Check your
              spam folder if not received.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-orange-400 hover:underline text-sm"
            >
              Try a different email
            </button>
          </div>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-gray-400 hover:text-orange-400 transition text-sm"
          >
            <FiArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
