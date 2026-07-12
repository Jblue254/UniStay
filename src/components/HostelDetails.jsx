import { useEffect, useState, useMemo } from "react";
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

const NAVY = "#0E1733";
const ORANGE = "#F98603";

const DEFAULT_MONTHLY_RENT = 6500;

const AMENITIES = [
  { icon: Wifi, label: "Free WiFi" },
  { icon: ShieldCheck, label: "24/7 Security" },
  { icon: Droplets, label: "Water Available" },
  { icon: Zap, label: "Electricity" },
  { icon: Car, label: "Parking" },
  { icon: Heart, label: "Student Friendly" },
];

const REVIEWS = [
  { name: "Brian", review: "Very secure and only five minutes from campus." },
  { name: "Faith", review: "The rooms are clean and the landlord is friendly." },
  { name: "Grace", review: "Affordable rent with reliable water and WiFi." },
];

function formatKES(amount) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
}

// RentCast/property data may expose rent under different field names
// depending on the listing source — check the common ones with a fallback.
function getMonthlyRent(hostel) {
  const rent =
    hostel?.price ??
    hostel?.rentAmount ??
    hostel?.monthlyRent ??
    DEFAULT_MONTHLY_RENT;
  return Number(rent) || DEFAULT_MONTHLY_RENT;
}

function buildGallery(id) {
  // Seed picsum images off a numeric hash of the id so non-numeric ids
  // (uuids, slugs, etc.) still produce stable, distinct images.
  const seed = String(id)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return Array.from({ length: 5 }, (_, i) => `https://picsum.photos/900/650?random=${seed + i}`);
}

export default function HostelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [saved, setSaved] = useState(false);

  const gallery = useMemo(() => buildGallery(id), [id]);

  useEffect(() => {
    let isMounted = true;

    async function loadHostel() {
      setLoading(true);
      setLoadError(false);

      try {
        const data = await getProperties();
        const property = Array.isArray(data)
          ? data.find((item) => String(item.id) === String(id))
          : null;

        if (!isMounted) return;
        setHostel(property || null);
      } catch (err) {
        console.error(err);
        if (isMounted) setLoadError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHostel();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (gallery.length > 0) setSelectedImage(gallery[0]);
  }, [gallery]);

  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem("savedHostels") || "[]");
    setSaved(savedIds.includes(id));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-500">
          Loading hostel details…
        </div>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
            Something Went Wrong
          </h2>
          <p className="text-gray-500 mt-3">
            We couldn't load this hostel's details. Please try again.
          </p>
          <Link to="/hostels" className="mt-6 font-semibold" style={{ color: ORANGE }}>
            Back to Hostels
          </Link>
        </div>
      </>
    );
  }

  if (!hostel) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-3xl font-bold" style={{ color: NAVY }}>
            Hostel Not Found
          </h2>
          <p className="text-gray-500 mt-3">
            This listing may have been removed or the link is incorrect.
          </p>
          <Link to="/hostels" className="mt-6 font-semibold" style={{ color: ORANGE }}>
            Back to Hostels
          </Link>
        </div>
      </>
    );
  }

  const monthlyRent = getMonthlyRent(hostel);
  const displayName = hostel.formattedAddress || "Untitled Listing";
  const displayLocation = [hostel.city, hostel.state].filter(Boolean).join(", ") || "Location unavailable";

  const handleBookViewing = () => {
    navigate("/checkout", {
      state: {
        bookingId: `${hostel.id}-${Date.now()}`,
        hostelName: displayName,
        amount: monthlyRent,
        image: selectedImage,
        location: displayLocation,
      },
    });
  };

  const handleContactLandlord = () => {
    window.location.href = "tel:+254700123456";
  };

  const handleSaveHostel = () => {
    const savedIds = JSON.parse(localStorage.getItem("savedHostels") || "[]");
    const updated = saved
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];

    localStorage.setItem("savedHostels", JSON.stringify(updated));
    setSaved(!saved);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Back */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <Link
          to="/hostels"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back to Hostels
        </Link>
      </div>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
          <img
            src={selectedImage}
            alt={`Main view of ${displayName}`}
            className="w-full h-[500px] object-cover rounded-xl bg-gray-200"
          />

          <div className="grid grid-cols-2 gap-4">
            {gallery.slice(1).map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className="p-0 border-0 rounded-xl overflow-hidden focus:outline-none focus:ring-2"
                style={{ "--tw-ring-color": ORANGE }}
                aria-label={`View photo ${index + 2} of ${displayName}`}
              >
                <img
                  src={image}
                  alt={`${displayName} photo ${index + 2}`}
                  className={`w-full h-60 object-cover cursor-pointer hover:opacity-80 transition ${
                    selectedImage === image ? "ring-4" : ""
                  }`}
                  style={selectedImage === image ? { boxShadow: `0 0 0 4px ${ORANGE}` } : undefined}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hostel Info */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: ORANGE, color: NAVY }}
              >
                Verified
              </span>

              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={18} fill="currentColor" />
                <span className="font-semibold text-gray-700">4.8</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mt-4" style={{ color: NAVY }}>
              {displayName}
            </h1>

            <div className="flex items-center gap-2 mt-5 text-gray-600">
              <MapPin size={18} />
              <span>{displayLocation}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mt-8" style={{ color: ORANGE }}>
              {formatKES(monthlyRent)} <span className="text-lg text-gray-500 font-normal">/ month</span>
            </h2>

            <div className="grid grid-cols-3 gap-8 mt-10">
              <div className="flex items-center gap-3">
                <BedDouble size={24} />
                <div>
                  <p className="text-gray-500 text-sm">Bedrooms</p>
                  <h4 className="font-bold">{hostel.bedrooms ?? "—"}</h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Bath size={24} />
                <div>
                  <p className="text-gray-500 text-sm">Bathrooms</p>
                  <h4 className="font-bold">{hostel.bathrooms ?? "—"}</h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Square size={24} />
                <div>
                  <p className="text-gray-500 text-sm">Square Feet</p>
                  <h4 className="font-bold">{hostel.squareFootage ?? "—"}</h4>
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
                {AMENITIES.map((item) => {
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
                  <h3 className="font-bold mt-2">{hostel.propertyType || "Residential"}</h3>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <p className="text-gray-500">Year Built</p>
                  <h3 className="font-bold mt-2">{hostel.yearBuilt || "N/A"}</h3>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <p className="text-gray-500">Bedrooms</p>
                  <h3 className="font-bold mt-2">{hostel.bedrooms ?? "—"}</h3>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <p className="text-gray-500">Bathrooms</p>
                  <h3 className="font-bold mt-2">{hostel.bathrooms ?? "—"}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-[360px]">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-4xl font-bold" style={{ color: ORANGE }}>
                {formatKES(monthlyRent)}
              </h2>
              <p className="text-gray-500">Per Month</p>

              <button
                onClick={handleContactLandlord}
                className="w-full mt-8 py-4 rounded-lg font-semibold text-white"
                style={{ backgroundColor: NAVY }}
              >
                Contact Landlord
              </button>

              <button
                onClick={handleBookViewing}
                className="w-full mt-4 py-4 rounded-lg font-semibold"
                style={{ border: `2px solid ${NAVY}`, color: NAVY }}
              >
                Book & Pay Now
              </button>

              <button
                onClick={handleSaveHostel}
                className="w-full mt-4 py-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                style={{ border: `2px solid ${ORANGE}`, color: ORANGE }}
              >
                <Heart size={18} fill={saved ? ORANGE : "none"} />
                {saved ? "Saved" : "Save Hostel"}
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
            {REVIEWS.map((review) => (
              <div key={review.name} className="bg-gray-50 rounded-xl p-6 shadow">
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