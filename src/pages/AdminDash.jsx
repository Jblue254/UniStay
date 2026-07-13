import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Building2,
  CalendarCheck,
} from "lucide-react";

import { getProperties } from "@/services/rentcast";

const NAVY = "#0E1733";
const ORANGE = "#F98603";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    hostels: 0,
    bookings: 0,
  });

  const [recentHostels, setRecentHostels] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      // Users
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Bookings
      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

      // Hostels from API
      const hostels = await getProperties();

      setRecentHostels(hostels.slice(0, 5));
      setRecentBookings(bookings.slice(-5).reverse());

      setStats({
        users: users.length,
        hostels: hostels.length,
        bookings: bookings.length,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const cards = [
    {
      title: "Total Users",
      value: stats.users,
      icon: Users,
      link: "/manageusers",
    },
    {
      title: "Total Hostels",
      value: stats.hostels,
      icon: Building2,
      link: "/managelistings",
    },
    {
      title: "Bookings",
      value: stats.bookings,
      icon: CalendarCheck,
      link: "/managebookings",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold" style={{ color: NAVY }}>
            Welcome, Admin!
          </h1>
          <p className="text-gray-500 mt-2">
            Here's what's happening on UniStay today.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Card
                key={card.title}
                className="shadow hover:shadow-lg transition"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Icon size={24} color={ORANGE} />
                    </div>
                    <p className="text-lg font-semibold" style={{ color: NAVY }}>
                      {card.title}
                    </p>
                  </div>

                  <h2 className="text-4xl font-bold mt-6" style={{ color: NAVY }}>
                    {card.value}
                  </h2>

                  <Link
                    to={card.link}
                    className="inline-block mt-6 font-semibold hover:underline"
                    style={{ color: ORANGE }}
                  >
                    View More
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Listings */}
          <Card className="shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: NAVY }}>
                  Recent Listings
                </h2>
                <Link
                  to="/managelistings"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ORANGE }}
                >
                  View More
                </Link>
              </div>

              {recentHostels.length > 0 ? (
                <div className="space-y-4">
                  {recentHostels.map((hostel) => (
                    <div
                      key={hostel.id}
                      className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {hostel.formattedAddress}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {hostel.city}, {hostel.state}
                        </p>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100"
                        style={{ color: ORANGE }}
                      >
                        {hostel.propertyType || "Hostel"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No listings available.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card className="shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: NAVY }}>
                  Recent Bookings
                </h2>
                <Link
                  to="/managebookings"
                  className="text-sm font-semibold hover:underline"
                  style={{ color: ORANGE }}
                >
                  View More
                </Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {booking.fullName || booking.name || "Student"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.hostelName || booking.location}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {booking.viewingDate || booking.checkIn}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No bookings available.
                </p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
