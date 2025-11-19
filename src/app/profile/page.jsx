"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  loadProfile,
  uploadImage,
  saveProfile,
} from "@/app/redux-toolkit/userSlice";
import { logoutUser } from "@/app/redux-toolkit/authSlice";
import Image from "next/image";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, loading } = useSelector((state) => state.user);

  const [location, setLocation] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setLocation(user.location || "");
      setPaymentStatus(Boolean(user.paymentStatus));
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch(uploadImage(file));
  };

  const handleSave = () => {
    dispatch(saveProfile({ location, paymentStatus }));
  };

  const handleDownloadPDF = () => {
    if (user?._id) {
      window.open(`/api/users/pdfgenerate?id=${user._id}`, "_blank");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      router.push("/login");
    }
  };

  const goToAdmin = () => router.push("/admin");

  if (loading || !user)
    return (
      <h1 className="text-center text-2xl font-semibold text-gray-600 mt-20 animate-pulse">
        Loading...
      </h1>
    );

  const isAdmin = user.role === "admin" || user.isAdmin === true;

  return (
    <div className="p-6 md:p-12 flex justify-center">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          User Profile
        </h1>

        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Logout
          </button>

          {isAdmin && (
            <button
              onClick={goToAdmin}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Go to Admin Panel
            </button>
          )}
        </div>

        {/* Profile Image */}
        {user.image && (
          <div className="mb-6 flex justify-center">
            <Image
              src={user.image}
              width={180}
              height={180}
              alt="Profile"
              unoptimized
              className="rounded-xl shadow-md"
            />
          </div>
        )}

        {/* Upload Image */}
        <div className="mb-5">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Profile Image:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded-lg w-full"
          />
        </div>

        {/* User Info */}
        <p className="text-gray-700 text-lg mb-2">
          <b>Name:</b> {user.firstname} {user.lastname}
        </p>

        <p className="text-gray-700 text-lg mb-4">
          <b>Email:</b> {user.email}
        </p>

        {/* Location */}
        <div className="mb-4">
          <label className="text-gray-700 font-semibold">Location:</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
            className="border border-gray-400 p-2 rounded-lg ml-3 w-64"
          />
        </div>

        {/* Payment Status */}
        <div className="mb-6">
          <label className="text-gray-700 font-semibold">
            Payment Status:
          </label>
          <span
            className={`ml-3 px-3 py-1 rounded-lg text-white font-semibold 
              ${
                paymentStatus ? "bg-green-600" : "bg-red-600"
              }`}
          >
            {paymentStatus ? "Paid" : "Unpaid"}
          </span>
        </div>

        {/* Save + Download Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-900 transition"
          >
            Save Details
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={!paymentStatus}
            className={`px-5 py-2 rounded-lg text-white shadow transition 
              ${
                paymentStatus
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed opacity-60"
              }`}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
