import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    const data =
      JSON.parse(localStorage.getItem("bookings")) || [];

    setBookings(data);
  };

  const updateStatus = (id, status) => {
    const updated = bookings.map((booking) =>
      booking.id === id
        ? { ...booking, status }
        : booking
    );

    setBookings(updated);
    localStorage.setItem(
      "bookings",
      JSON.stringify(updated)
    );
  };

  const deleteBooking = (id) => {
    if (!window.confirm("Delete this booking?")) return;

    const updated = bookings.filter(
      (booking) => booking.id !== id
    );

    setBookings(updated);

    localStorage.setItem(
      "bookings",
      JSON.stringify(updated)
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto p-8">

        <Card>

          <CardHeader>
            <CardTitle>
              Manage Bookings
            </CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-[#F98603] text-white">

                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {bookings.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      className="text-center py-8 text-gray-500"
                    >
                      No bookings found.
                    </td>

                  </tr>

                ) : (

                  bookings.map((booking) => (

                    <tr
                      key={booking.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3">
                        {booking.fullName}
                      </td>

                      <td className="p-3">
                        {booking.email}
                      </td>

                      <td className="p-3">
                        {booking.phone}
                      </td>

                      <td className="p-3">
                        {booking.viewingDate}
                      </td>

                      <td className="p-3">
                        {booking.viewingTime}
                      </td>

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            booking.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.status}
                        </span>

                      </td>

                      <td className="p-3">

                        <div className="flex gap-2 justify-center">

                          <Button
                            size="sm"
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "Approved"
                              )
                            }
                          >
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatus(
                                booking.id,
                                "Rejected"
                              )
                            }
                          >
                            Reject
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              deleteBooking(booking.id)
                            }
                          >
                            Delete
                          </Button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}