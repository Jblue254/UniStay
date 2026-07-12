import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [booking, setBooking] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    viewingDate: "",
    viewingTime: "",
    notes: "",
  });

  const handleChange = (e) => {
    setBooking({
      ...booking,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Scoped to the logged-in user so Profile can look this up reliably —
    // ProtectedRoute guarantees `user` exists by the time this form is reachable.
    localStorage.setItem(
      `bookedHostel_${user.email}`,
      JSON.stringify({
        hostelId: id,
        ...booking,
        status: "Viewing Booked",
        createdAt: new Date().toISOString(),
      }),
    );

    navigate("/booking-confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#0E1733]">
          Book a Hostel Viewing
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Complete the form below to schedule a hostel viewing.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Full Name</label>

            <input
              type="text"
              name="fullName"
              value={booking.fullName}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F98603]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email Address</label>

            <input
              type="email"
              name="email"
              value={booking.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F98603]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Phone Number</label>

            <input
              type="tel"
              name="phone"
              value={booking.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F98603]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-medium">Viewing Date</label>

              <input
                type="date"
                name="viewingDate"
                value={booking.viewingDate}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F98603]"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Viewing Time</label>

              <input
                type="time"
                name="viewingTime"
                value={booking.viewingTime}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F98603]"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Additional Notes (Optional)
            </label>

            <textarea
              rows="4"
              name="notes"
              value={booking.notes}
              onChange={handleChange}
              placeholder="Any questions or special requests..."
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#F98603]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0E1733] hover:bg-[#16214d] text-white py-3 rounded-lg font-semibold transition"
          >
            Confirm Viewing Booking
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;