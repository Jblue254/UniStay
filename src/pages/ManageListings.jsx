import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getProperties } from "@/services/rentcast";
import { getHostelImages } from "@/services/unsplash";

const NAVY = "#0E1733";
const ORANGE = "#F98603";

export default function ManageListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      setLoading(true);

      const properties = await getProperties();
      const images = await getHostelImages(20);

      const combined = properties.map((property, index) => ({
        ...property,
        image:
          images[index]?.urls?.regular ||
          images[index]?.urls?.small ||
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600",
      }));

      setListings(combined);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card>

          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle
              className="text-2xl font-bold"
              style={{ color: NAVY }}
            >
              Manage Listings
            </CardTitle>

            <Link to="/addhostel">
              <Button
                style={{
                  backgroundColor: NAVY,
                  color: "white",
                }}
              >
                + Add Listing
              </Button>
            </Link>
          </CardHeader>

          <CardContent className="overflow-x-auto">

            {loading ? (
              <p className="text-center py-10">
                Loading listings...
              </p>
            ) : (

              <table className="w-full">

                <thead className="bg-[#F98603] text-white">
                  <tr>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Address</th>
                    <th className="p-3 text-left">City</th>
                    <th className="p-3 text-left">Bedrooms</th>
                    <th className="p-3 text-left">Bathrooms</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {listings.map((listing) => (

                    <tr
                      key={listing.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3">
                        <img
                          src={listing.image}
                          alt="Hostel"
                          className="w-24 h-16 object-cover rounded-lg"
                        />
                      </td>

                      <td className="p-3">
                        {listing.formattedAddress}
                      </td>

                      <td className="p-3">
                        {listing.city}
                      </td>

                      <td className="p-3">
                        {listing.bedrooms ?? "-"}
                      </td>

                      <td className="p-3">
                        {listing.bathrooms ?? "-"}
                      </td>

                      <td className="p-3">
                        {listing.propertyType}
                      </td>

                      <td className="p-3">

                        <div className="flex justify-center gap-2">


                          <Button
                            size="sm"
                            variant="outline"
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                          >
                            Delete
                          </Button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            )}

          </CardContent>

        </Card>
      </div>
    </div>
  );
}