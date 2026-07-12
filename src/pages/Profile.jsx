import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StudentForm from "../components/StudentForm";
import StudentInfo from "../components/StudentInfo";
import HostelBooked from "../components/HostelBooked";
import PaymentCard from "../components/PaymentCard";
import AnnouncementCard from "../components/AnnouncementCard";

const Profile = () => {
  const { user } = useAuth();

  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [hostel, setHostel] = useState(null);
  const [payment] = useState(null);
  const [announcements] = useState([]);

  useEffect(() => {
    if (!user) return;

    const savedProfile = localStorage.getItem(
      `studentProfile_${user.email}`
    );

    if (savedProfile) {
      setStudent(JSON.parse(savedProfile));
    }

    const savedHostel = localStorage.getItem("bookedHostel");

    if (savedHostel) {
      setHostel(JSON.parse(savedHostel));
    }
  }, [user]);

  const handleSave = (studentData) => {
    if (!user) return;

    localStorage.setItem(
      `studentProfile_${user.email}`,
      JSON.stringify(studentData)
    );

    setStudent(studentData);
    setIsEditing(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleCancelBooking = () => {
    localStorage.removeItem("bookedHostel");
    setHostel(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0E1733] flex items-center justify-center">
        <h2 className="text-white text-2xl font-semibold">
          Please login to access your profile.
        </h2>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#0E1733] py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {showSuccess && (
            <div className="mb-6 rounded-lg bg-green-100 border border-green-400 text-green-700 px-4 py-3">
               Profile saved successfully!
            </div>
          )}

          {!student || isEditing ? (
            <StudentForm
              student={student}
              onSave={handleSave}
            />
          ) : (
            <div className="space-y-8">
              {/* Dashboard Header */}
              <div className="bg-[#15254D] rounded-2xl shadow-lg p-8 text-white">
                <h1 className="text-4xl font-bold">
                  Student Dashboard
                </h1>

                <p className="mt-4 text-xl">
                  Welcome back,
                  <span className="text-[#F98603] font-semibold">
                    {" "}
                    {student.fullName}
                  </span>
                </p>

                <p className="mt-3 text-gray-300 max-w-3xl leading-relaxed">
                  Manage your hostel profile, bookings, payments and stay
                  updated with announcements from your hostel administration.
                </p>
              </div>

              {/* Student Information */}
              <StudentInfo
                student={student}
                onEdit={() => setIsEditing(true)}
              />

              {/* Hostel Booking */}
              <HostelBooked
                hostel={hostel}
                onCancel={handleCancelBooking}
              />

              {/* Payment Information */}
              <PaymentCard payment={payment} />

              {/* Announcements */}
              <AnnouncementCard
                announcements={announcements}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;