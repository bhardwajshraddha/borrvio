import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiDownload, FiStar } from 'react-icons/fi';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState({ stars: 5, comment: '' });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const found = data.find(b => b._id === id);
        setBooking(found);
      } catch (error) {
        toast.error('Booking not found!');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleRating = async () => {
    try {
      await axios.post('http://localhost:5000/api/ratings', {
        bookingId: id,
        toUserId: booking.owner._id,
        stars: rating.stars,
        comment: rating.comment,
        ratingType: 'Renter-to-Owner'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Rating submitted!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Rating failed!');
    }
  };

  const downloadAgreement = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/agreements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.open(`http://localhost:5000${data.pdfUrl}`, '_blank');
    } catch (error) {
      toast.error('Agreement not found!');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <p className="text-gray-400">Booking not found!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">

      <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-800">
        <h1 onClick={() => navigate('/')} className="text-2xl font-bold text-orange-500 cursor-pointer">Borrvio</h1>
        <button onClick={() => navigate('/renter-dashboard')} className="px-4 py-2 border border-gray-700 rounded-lg hover:border-orange-500 transition">Back</button>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a1a2e] rounded-2xl p-6 border border-gray-800 mb-6">
          <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
          <div className="flex flex-col gap-3 text-gray-400">
            <div className="flex justify-between"><span>Item</span><span className="text-white font-semibold">{booking.item?.name}</span></div>
            <div className="flex justify-between"><span>Owner</span><span className="text-white">{booking.owner?.name}</span></div>
            <div className="flex justify-between"><span>Start Date</span><span className="text-white">{new Date(booking.startDate).toDateString()}</span></div>
            <div className="flex justify-between"><span>End Date</span><span className="text-white">{new Date(booking.endDate).toDateString()}</span></div>
            <div className="flex justify-between"><span>Total Days</span><span className="text-white">{booking.totalDays}</span></div>
            <div className="flex justify-between"><span>Total Amount</span><span className="text-orange-500 font-bold">₹{booking.totalAmount}</span></div>
            <div className="flex justify-between"><span>Deposit</span><span className="text-white">₹{booking.depositAmount}</span></div>
            <div className="flex justify-between"><span>Status</span><span className="text-orange-500 font-semibold">{booking.status}</span></div>
            <div className="flex justify-between"><span>Deposit Status</span><span className="text-white">{booking.depositStatus}</span></div>
          </div>

          {/* Download Agreement */}
          <button
            onClick={downloadAgreement}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-[#0f0f1a] border border-gray-700 hover:border-orange-500 py-3 rounded-xl transition"
          >
            <FiDownload /> Download Rental Agreement
          </button>
        </motion.div>

        {/* Rating Section */}
        {booking.status === 'Completed' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a1a2e] rounded-2xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><FiStar className="text-yellow-400" /> Rate Your Experience</h3>

            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">Stars</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating({ ...rating, stars: star })}
                    className={`text-2xl ${star <= rating.stars ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-1 block">Comment</label>
              <textarea
                value={rating.comment}
                onChange={(e) => setRating({ ...rating, comment: e.target.value })}
                placeholder="Share your experience..."
                rows={3}
                className="w-full bg-[#0f0f1a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>

            <button
              onClick={handleRating}
              className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold transition"
            >
              Submit Rating
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingDetail;