import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Star,
  Wifi,
  ShieldCheck,
  Car,
  Droplets,
  Zap,
  Phone,
  Heart,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProperties } from "@/services/rentcast";
import { getHostelImages } from "@/services/unsplash";

const NAVY = "#0E1733";
const ORANGE = "#F98603";

export default function HostelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    async function loadHostel() {
      try {
        const [properties, unsplashImages] = await Promise.all([
          getProperties(),
          getHostelImages(5),
        ]);

        const property = properties.find(
          (item) => String(item.id) === String(id)
        );

        setHostel(property);
        setImages(unsplashImages);

        if (unsplashImages.length > 0) {
          setSelectedImage(unsplashImages[0].urls.regular);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHostel();
  }, [id]);

  const handleBookViewing = () => {
    const booking = {
      id: hostel.id,
      name: hostel.formattedAddress,
      location: `${hostel.city}, ${hostel.state}`,
      room: "Room will be allocated",
      checkIn: new Date().toLocaleDateString(),
      price: "KES 6,500 / Month",
      image: selectedImage,
    };

    localStorage.setItem("bookedHostel", JSON.stringify(booking));

    toast.success("Booking Successful!", {
      description: "Redirecting to your profile...",
    });

    setTimeout(() => {
      navigate("/profile");
    }, 1500);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
          Loading hostel...
        </div>
      </>
    );
  }

  if (!hostel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold">Hostel Not Found</h2>
          <Link to="/hostels" className="mt-6 text-blue-600">
            Back to Hostels
          </Link>
        </div>
      </>
    );
  }

  const gallery = images.map((img) => img.urls.regular);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <Link
          to="/hostels"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Hostels
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
          <img
            src={selectedImage}
            alt={hostel.formattedAddress}
            className="w-full h-[500px] object-cover rounded-xl"
          />

          <div className="grid grid-cols-2 gap-4">
            {gallery.slice(1, 5).map((image, index) => (
              <img
                key={index}
                src={image}
                alt=""
                onClick={() => setSelectedImage(image)}
                className="w-full h-60 object-cover rounded-xl cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: ORANGE,
                  color: NAVY,
                }}
              >
                Verified
              </span>

              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={18} fill="currentColor" />
                <span className="font-semibold">4.8</span>
              </div>
            </div>

            <h1 className="text-5xl font-bold mt-4" style={{ color: NAVY }}>
              {hostel.formattedAddress}
            </h1>

            <div className="flex items-center gap-2 mt-5 text-gray-600">
              <MapPin size={18} />
              <span>
                {hostel.city}, {hostel.state}
              </span>
            </div>

            <h2 className="text-4xl font-bold mt-8" style={{ color: ORANGE }}>
              KES 6,500 / Month
            </h2>

            <div className="grid grid-cols-3 gap-8 mt-10">
              <div className="flex items-center gap-3">
                <BedDouble size={24} />
                <div>
                  <p className="text-gray-500 text-sm">Bedrooms</p>
                  <h4 className="font-bold">{hostel.bedrooms ?? "-"}</h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Bath size={24} />
                <div>
                  <p className="text-gray-500 text-sm">Bathrooms</p>
                  <h4 className="font-bold">{hostel.bathrooms ?? "-"}</h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Square size={24} />
                <div>
                  <p className="text-gray-500 text-sm">Square Feet</p>
                  <h4 className="font-bold">{hostel.squareFootage ?? "-"}</h4>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
                About this Hostel
              </h2>
              <p className="text-gray-600 leading-8 mt-5">
                This verified student hostel offers a safe, comfortable and
                affordable living environment close to campus. Students enjoy
                reliable water, electricity, secure premises and spacious rooms.
                The location provides easy access to shopping centres, transport
                and university facilities, making it an excellent choice for
                both new and continuing students.
              </p>
            </div>

            {/* Amenities */}
            <div className="mt-14">
              <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
                Amenities
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                {[
                  { icon: Wifi, label: "Free WiFi" },
                  { icon: ShieldCheck, label: "24/7 Security" },
                  { icon: Droplets, label: "Water Available" },
                  { icon: Zap, label: "Electricity" },
                  { icon: Car, label: "Parking" },
                  { icon: Heart, label: "Student Friendly" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 bg-white rounded-xl shadow p-5"
                    >
                      <Icon size={26} style={{ color: ORANGE }} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Property Details */}
            <div className="mt-16">
              <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
                Property Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow p-6">
                  <p className="text-gray-500">Property Type</p>
                  <h3 className="font-bold mt-2">
                    {hostel.propertyType || "Residential"}
                  </h3>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <p className="text-gray-500">Year Built</p>
                  <h3 className="font-bold mt-2">
                    {hostel.yearBuilt || "N/A"}
                  </h3>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <p className="text-gray-500">Bedrooms</p>
                  <h3 className="font-bold mt-2">{hostel.bedrooms ?? "-"}</h3>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <p className="text-gray-500">Bathrooms</p>
                  <h3 className="font-bold mt-2">{hostel.bathrooms ?? "-"}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-[360px]">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-4xl font-bold" style={{ color: ORANGE }}>
                KES 6,500
              </h2>
              <p className="text-gray-500">Per Month</p>

              <button
                className="w-full mt-8 py-4 rounded-lg font-semibold text-white"
                style={{ backgroundColor: NAVY }}
              >
                Contact Landlord
              </button>

              <button
                onClick={handleBookViewing}
                className="w-full mt-4 py-4 rounded-lg font-semibold transition-all duration-300 hover:bg-[#0E1733] hover:text-white"
                style={{
                  border: `2px solid ${NAVY}`,
                  color: NAVY,
                }}
              >
                Book Hostel
              </button>

              <button
                className="w-full mt-4 py-4 rounded-lg font-semibold"
                style={{
                  border: `2px solid ${ORANGE}`,
                  color: ORANGE,
                }}
              >
                Save Hostel
              </button>

              <div className="border-t mt-8 pt-6">
                <div className="flex items-center gap-3">
                  <Phone size={18} style={{ color: ORANGE }} />
                  <span>+254 700 123 456</span>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  Contact the landlord to schedule a visit or ask any questions
                  about the hostel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
            Student Reviews
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              {
                name: "Brian",
                review: "Very secure and only five minutes from campus.",
              },
              {
                name: "Faith",
                review: "The rooms are clean and the landlord is friendly.",
              },
              {
                name: "Grace",
                review: "Affordable rent with reliable water and WiFi.",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="bg-gray-50 rounded-xl p-6 shadow"
              >
                <div className="flex gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-5 text-gray-600">"{review.review}"</p>
                <h4 className="font-bold mt-6" style={{ color: NAVY }}>
                  {review.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}